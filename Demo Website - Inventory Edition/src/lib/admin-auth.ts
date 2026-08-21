import { scryptSync, timingSafeEqual } from "node:crypto";
import { env } from "node:process";

import { createServerFn } from "@tanstack/react-start";
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

function getSessionSecret() {
  const secret = env["SESSION_SECRET"];
  if (!secret || secret.length < 32) return null;
  return secret;
}

function getPasswordHash() {
  const encoded = env["ADMIN_PASSWORD_HASH"];
  if (!encoded) return null;

  const [algorithm, saltHex, hashHex] = encoded.split("$");
  if (algorithm !== "scrypt" || !saltHex || !hashHex) return null;

  try {
    const salt = Buffer.from(saltHex, "hex");
    const hash = Buffer.from(hashHex, "hex");
    if (!salt.length || hash.length !== 64) return null;
    return { salt, hash };
  } catch {
    return null;
  }
}

function authIsConfigured() {
  return Boolean(getSessionSecret() && getPasswordHash());
}

async function useAdminSession() {
  const secret = getSessionSecret();
  if (!secret) return null;

  return useSession<AdminSession>({
    name: "northline-admin",
    password: secret,
    maxAge: 60 * 60 * 12,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: env["NODE_ENV"] === "production",
      path: "/",
    },
  });
}

function isRateLimited(key: string) {
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 0, resetAt: now + ATTEMPT_WINDOW_MS });
    return false;
  }
  return current.count >= ATTEMPT_LIMIT;
}

function recordFailure(key: string) {
  const current = attempts.get(key);
  if (current) current.count += 1;
}

function verifyPassword(password: string) {
  const stored = getPasswordHash();
  if (!stored) return false;

  const candidate = scryptSync(password, stored.salt, stored.hash.length);
  return timingSafeEqual(candidate, stored.hash);
}

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
