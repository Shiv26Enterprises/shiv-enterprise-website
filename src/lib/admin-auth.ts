import { timingSafeEqual } from "node:crypto";
import { env } from "node:process";

import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import { getRequestIP, useSession } from "@tanstack/react-start/server";
import { z } from "zod";

type AdminSession = {
  admin?: boolean;
};

const loginSchema = z.object({
  password: z.string().min(1).max(256),
});

const attempts = new Map<string, { count: number; resetAt: number }>();
const ATTEMPT_LIMIT = 5;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;

const getSessionSecret = createServerOnlyFn(() => {
  const secret = env["SESSION_SECRET"];
  if (!secret || secret.length < 32) return null;
  return secret;
});

const getAdminPassword = createServerOnlyFn(() => {
  const password = env["ADMIN_PASSWORD"];
  if (!password || password.length < 12 || password.length > 256) return null;
  return password;
});

const authIsConfigured = createServerOnlyFn(() => {
  return Boolean(getSessionSecret() && getAdminPassword());
});

const useAdminSession = createServerOnlyFn(async () => {
  const secret = getSessionSecret();
  if (!secret) return null;

  return useSession<AdminSession>({
    name: "ironclad-machinery-admin",
    password: secret,
    maxAge: 60 * 60 * 12,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: env["NODE_ENV"] === "production",
      path: "/",
    },
  });
});

export const requireAdminSession = createServerOnlyFn(async () => {
  const session = await useAdminSession();
  if (!session || session.data.admin !== true) {
    throw new Error("Your admin session has expired. Please sign in again.");
  }
  return session;
});

const isRateLimited = createServerOnlyFn((key: string) => {
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 0, resetAt: now + ATTEMPT_WINDOW_MS });
    return false;
  }
  return current.count >= ATTEMPT_LIMIT;
});

const recordFailure = createServerOnlyFn((key: string) => {
  const current = attempts.get(key);
  if (current) current.count += 1;
});

const verifyPassword = createServerOnlyFn((password: string) => {
  const stored = getAdminPassword();
  if (!stored) return false;
  const candidate = Buffer.from(password, "utf8");
  const expected = Buffer.from(stored, "utf8");
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
});

export const getAdminStatus = createServerFn({ method: "GET" }).handler(async () => {
  const configured = authIsConfigured();
  if (!configured) return { configured: false, authenticated: false };

  const session = await useAdminSession();
  return {
    configured: true,
    authenticated: session?.data.admin === true,
  };
});

export const loginAdmin = createServerFn({ method: "POST" })
  .validator(loginSchema)
  .handler(async ({ data }) => {
    if (!authIsConfigured()) {
      return { ok: false as const, error: "Admin authentication is not configured on the server." };
    }

    const key = getRequestIP() || "unknown";
    if (isRateLimited(key)) {
      return { ok: false as const, error: "Too many attempts. Try again in 15 minutes." };
    }

    if (!verifyPassword(data.password)) {
      recordFailure(key);
      return { ok: false as const, error: "Incorrect password." };
    }

    attempts.delete(key);
    const session = await useAdminSession();
    if (!session) {
      return { ok: false as const, error: "Admin authentication is not configured on the server." };
    }
    await session.update({ admin: true });
    return { ok: true as const };
  });

export const logoutAdmin = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useAdminSession();
  await session?.clear();
  return { ok: true as const };
});
