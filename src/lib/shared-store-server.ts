import { env as processEnv } from "node:process";

import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import { getRequest, getRequestIP } from "@tanstack/react-start/server";
import { z } from "zod";

import { requireAdminSession } from "@/lib/admin-auth";
import {
  defaultState,
  seedMachines,
  seedSettings,
  type Enquiry,
  type Machine,
  type Settings,
  type StoreState,
} from "@/lib/store";

type D1Result<T = Record<string, unknown>> = { results?: T[]; success: boolean };
type D1Statement = {
  bind: (...values: unknown[]) => D1Statement;
  all: <T = Record<string, unknown>>() => Promise<D1Result<T>>;
  first: <T = Record<string, unknown>>() => Promise<T | null>;
  run: () => Promise<D1Result>;
};
type D1Database = {
  prepare: (query: string) => D1Statement;
  batch: (statements: D1Statement[]) => Promise<D1Result[]>;
};
type RuntimeRequest = Request & {
  runtime?: { cloudflare?: { env?: Record<string, unknown> } };
};

const machineSchema = z.object({
  name: z.string().trim().min(2).max(180),
  caption: z.string().trim().min(2).max(240),
  description: z.string().trim().max(8_000),
  available: z.boolean(),
  image: z.string().max(1_600_000),
  gallery: z.array(z.string().max(1_600_000)).max(12),
  specs: z
    .array(
      z.object({
        label: z.string().trim().min(1).max(100),
        value: z.string().trim().min(1).max(300),
      }),
    )
    .max(30),
});

const settingsSchema = z.object({
  businessName: z.string().trim().min(1).max(150),
  address: z.string().trim().max(500),
  phone: z.string().trim().max(200),
  email: z.string().trim().max(300),
  whatsapp: z.string().trim().max(50),
  gst: z.string().trim().max(100),
  marqueeEnabled: z.boolean(),
  marqueeSpeed: z.enum(["slow", "normal", "fast"]),
  proofPoints: z
    .array(z.object({ value: z.string().trim().max(50), label: z.string().trim().max(100) }))
    .max(8),
});

const mutationSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("addMachine"), machine: machineSchema }),
  z.object({ action: z.literal("updateMachine"), id: z.string().min(1), machine: machineSchema }),
  z.object({ action: z.literal("deleteMachine"), id: z.string().min(1) }),
  z.object({
    action: z.literal("moveMachine"),
    id: z.string().min(1),
    direction: z.union([z.literal(-1), z.literal(1)]),
  }),
  z.object({ action: z.literal("toggleAvailability"), id: z.string().min(1) }),
  z.object({ action: z.literal("updateSettings"), settings: settingsSchema }),
  z.object({ action: z.literal("markEnquiry"), id: z.string().min(1), value: z.boolean() }),
  z.object({ action: z.literal("resolveEnquiry"), id: z.string().min(1), value: z.boolean() }),
  z.object({ action: z.literal("deleteEnquiry"), id: z.string().min(1) }),
  z.object({ action: z.literal("reset") }),
]);

const enquirySchema = z.object({
  name: z.string().trim().min(2).max(120),
  company: z.string().trim().max(160).default(""),
  phone: z.string().trim().min(7).max(40),
  email: z.string().trim().email().max(200),
  machine: z.string().trim().max(180).default(""),
  requirement: z.string().trim().min(10).max(5_000),
  website: z.string().max(0).optional().default(""),
});

const memoryKey = Symbol.for("shiv-enterprises.shared-store");
type SharedGlobal = typeof globalThis & { [memoryKey]?: StoreState };
const rateLimits = new Map<string, { count: number; resetAt: number }>();

export const getRuntimeEnv = createServerOnlyFn(() => {
  try {
    const request = getRequest() as RuntimeRequest;
    return request.runtime?.cloudflare?.env ?? processEnv;
  } catch {
    return processEnv;
  }
});

const getDb = createServerOnlyFn(() => {
  const candidate = getRuntimeEnv()["DB"];
  if (candidate && typeof candidate === "object" && "prepare" in candidate)
    return candidate as D1Database;
  if (processEnv["NODE_ENV"] === "production")
    throw new Error("The shared machinery database is not configured.");
  return null;
});

function cloneDefaults(): StoreState {
  return {
    machines: seedMachines.map((machine) => ({
      ...machine,
      gallery: [...machine.gallery],
      specs: machine.specs.map((spec) => ({ ...spec })),
    })),
    settings: {
      ...seedSettings,
      proofPoints: seedSettings.proofPoints.map((point) => ({ ...point })),
    },
    enquiries: [],
  };
}

function getMemoryState() {
  const shared = globalThis as SharedGlobal;
  shared[memoryKey] ??= cloneDefaults();
  return shared[memoryKey];
}

function setMemoryState(state: StoreState) {
  (globalThis as SharedGlobal)[memoryKey] = state;
}

function safeJson<T>(value: unknown, fallback: T): T {
  try {
    return typeof value === "string" ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

async function ensureDatabase(db: D1Database) {
  await db.batch([
    db.prepare(
      "CREATE TABLE IF NOT EXISTS machines (id TEXT PRIMARY KEY, name TEXT NOT NULL, caption TEXT NOT NULL, description TEXT NOT NULL, available INTEGER NOT NULL DEFAULT 1, image TEXT NOT NULL, gallery_json TEXT NOT NULL DEFAULT '[]', specs_json TEXT NOT NULL DEFAULT '[]', sort_order INTEGER NOT NULL, updated_at TEXT NOT NULL)",
    ),
    db.prepare("CREATE INDEX IF NOT EXISTS machines_sort_order_idx ON machines (sort_order)"),
    db.prepare(
      "CREATE TABLE IF NOT EXISTS site_settings (id INTEGER PRIMARY KEY, business_name TEXT NOT NULL, address TEXT NOT NULL, phone TEXT NOT NULL, email TEXT NOT NULL, whatsapp TEXT NOT NULL, gst TEXT NOT NULL, marquee_enabled INTEGER NOT NULL DEFAULT 1, marquee_speed TEXT NOT NULL DEFAULT 'normal', proof_points_json TEXT NOT NULL DEFAULT '[]', updated_at TEXT NOT NULL)",
    ),
    db.prepare(
      "CREATE TABLE IF NOT EXISTS enquiries (id TEXT PRIMARY KEY, name TEXT NOT NULL, company TEXT NOT NULL DEFAULT '', phone TEXT NOT NULL, email TEXT NOT NULL, machine TEXT NOT NULL DEFAULT '', requirement TEXT NOT NULL, created_at TEXT NOT NULL, read INTEGER NOT NULL DEFAULT 0, resolved INTEGER NOT NULL DEFAULT 0)",
    ),
    db.prepare(
      "CREATE INDEX IF NOT EXISTS enquiries_created_at_idx ON enquiries (created_at DESC)",
    ),
  ]);

  const machineCount = await db
    .prepare("SELECT COUNT(*) AS count FROM machines")
    .first<{ count: number }>();
  if (!machineCount?.count) await seedDatabase(db, false);
  const settingsCount = await db
    .prepare("SELECT COUNT(*) AS count FROM site_settings")
    .first<{ count: number }>();
  if (!settingsCount?.count) await upsertSettings(db, seedSettings);
  else {
    await db
      .prepare("UPDATE site_settings SET email = ?, updated_at = ? WHERE email = ?")
      .bind(
        "infor.shiventerprise26@gmail.com · anil04172@gmail.com",
        new Date().toISOString(),
        "anil04172@gmail.com · infor.shiventerprise26@gmail.com",
      )
      .run();
  }
}

function machineStatement(db: D1Database, machine: Machine) {
  return db
    .prepare(
      "INSERT OR REPLACE INTO machines (id, name, caption, description, available, image, gallery_json, specs_json, sort_order, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    )
    .bind(
      machine.id,
      machine.name,
      machine.caption,
      machine.description,
      machine.available ? 1 : 0,
      machine.image,
      JSON.stringify(machine.gallery),
      JSON.stringify(machine.specs),
      machine.order,
      new Date().toISOString(),
    );
}

async function seedDatabase(db: D1Database, clear = true) {
  if (clear)
    await db.batch([
      db.prepare("DELETE FROM machines"),
      db.prepare("DELETE FROM enquiries"),
      db.prepare("DELETE FROM site_settings"),
    ]);
  await db.batch(seedMachines.map((machine) => machineStatement(db, machine)));
  await upsertSettings(db, seedSettings);
}

async function upsertSettings(db: D1Database, settings: Settings) {
  await db
    .prepare(
      "INSERT OR REPLACE INTO site_settings (id, business_name, address, phone, email, whatsapp, gst, marquee_enabled, marquee_speed, proof_points_json, updated_at) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    )
    .bind(
      settings.businessName,
      settings.address,
      settings.phone,
      settings.email,
      settings.whatsapp,
      settings.gst,
      settings.marqueeEnabled ? 1 : 0,
      settings.marqueeSpeed,
      JSON.stringify(settings.proofPoints),
      new Date().toISOString(),
    )
    .run();
}

async function readState(db: D1Database): Promise<StoreState> {
  const [machineResult, enquiryResult, settingsRow] = await Promise.all([
    db.prepare("SELECT * FROM machines ORDER BY sort_order ASC").all<Record<string, unknown>>(),
    db.prepare("SELECT * FROM enquiries ORDER BY created_at DESC").all<Record<string, unknown>>(),
    db.prepare("SELECT * FROM site_settings WHERE id = 1").first<Record<string, unknown>>(),
  ]);
  const machines: Machine[] = (machineResult.results ?? []).map((row) => ({
    id: String(row["id"]),
    name: String(row["name"]),
    caption: String(row["caption"]),
    description: String(row["description"]),
    available: Boolean(row["available"]),
    image: String(row["image"]),
    gallery: safeJson(String(row["gallery_json"]), []),
    specs: safeJson(String(row["specs_json"]), []),
    order: Number(row["sort_order"]),
  }));
  const enquiries: Enquiry[] = (enquiryResult.results ?? []).map((row) => ({
    id: String(row["id"]),
    name: String(row["name"]),
    company: String(row["company"]),
    phone: String(row["phone"]),
    email: String(row["email"]),
    machine: String(row["machine"]),
    requirement: String(row["requirement"]),
    createdAt: String(row["created_at"]),
    read: Boolean(row["read"]),
    resolved: Boolean(row["resolved"]),
  }));
  const settings: Settings = settingsRow
    ? {
        businessName: String(settingsRow["business_name"]),
        address: String(settingsRow["address"]),
        phone: String(settingsRow["phone"]),
        email: String(settingsRow["email"]),
        whatsapp: String(settingsRow["whatsapp"]),
        gst: String(settingsRow["gst"]),
        marqueeEnabled: Boolean(settingsRow["marquee_enabled"]),
        marqueeSpeed: String(settingsRow["marquee_speed"]) as Settings["marqueeSpeed"],
        proofPoints: safeJson(String(settingsRow["proof_points_json"]), seedSettings.proofPoints),
      }
    : seedSettings;
  return { machines, settings, enquiries };
}

async function currentState() {
  const db = getDb();
  if (!db) return getMemoryState();
  await ensureDatabase(db);
  return readState(db);
}

export const getSharedStore = createServerFn({ method: "GET" }).handler(async () => currentState());

export const mutateSharedStore = createServerFn({ method: "POST" })
  .validator(mutationSchema)
  .handler(async ({ data }) => {
    await requireAdminSession();
    const db = getDb();
    if (!db) {
      const state = structuredClone(getMemoryState());
      if (data.action === "addMachine")
        state.machines.unshift({
          ...data.machine,
          id: `${slug(data.machine.name)}-${crypto.randomUUID().slice(0, 6)}`,
          order: 0,
        });
      if (data.action === "updateMachine")
        state.machines = state.machines.map((machine) =>
          machine.id === data.id ? { ...machine, ...data.machine } : machine,
        );
      if (data.action === "deleteMachine")
        state.machines = state.machines.filter((machine) => machine.id !== data.id);
      if (data.action === "toggleAvailability")
        state.machines = state.machines.map((machine) =>
          machine.id === data.id ? { ...machine, available: !machine.available } : machine,
        );
      if (data.action === "moveMachine") moveInArray(state.machines, data.id, data.direction);
      if (data.action === "updateSettings") state.settings = data.settings;
      if (data.action === "markEnquiry")
        state.enquiries = state.enquiries.map((item) =>
          item.id === data.id ? { ...item, read: data.value } : item,
        );
      if (data.action === "resolveEnquiry")
        state.enquiries = state.enquiries.map((item) =>
          item.id === data.id ? { ...item, resolved: data.value } : item,
        );
      if (data.action === "deleteEnquiry")
        state.enquiries = state.enquiries.filter((item) => item.id !== data.id);
      if (data.action === "reset") return (setMemoryState(cloneDefaults()), getMemoryState());
      state.machines = state.machines.map((machine, order) => ({ ...machine, order }));
      setMemoryState(state);
      return state;
    }

    await ensureDatabase(db);
    if (data.action === "addMachine") {
      const state = await readState(db);
      const created = {
        ...data.machine,
        id: `${slug(data.machine.name)}-${crypto.randomUUID().slice(0, 6)}`,
        order: 0,
      };
      await db.batch([
        db.prepare("UPDATE machines SET sort_order = sort_order + 1"),
        machineStatement(db, created),
      ]);
    } else if (data.action === "updateMachine") {
      const existing = await db
        .prepare("SELECT sort_order FROM machines WHERE id = ?")
        .bind(data.id)
        .first<{ sort_order: number }>();
      if (!existing) throw new Error("Machine not found.");
      await machineStatement(db, {
        ...data.machine,
        id: data.id,
        order: existing.sort_order,
      }).run();
    } else if (data.action === "deleteMachine") {
      await db.prepare("DELETE FROM machines WHERE id = ?").bind(data.id).run();
      await normalizeOrder(db);
    } else if (data.action === "toggleAvailability") {
      await db
        .prepare(
          "UPDATE machines SET available = CASE available WHEN 1 THEN 0 ELSE 1 END, updated_at = ? WHERE id = ?",
        )
        .bind(new Date().toISOString(), data.id)
        .run();
    } else if (data.action === "moveMachine") {
      const rows =
        (
          await db
            .prepare("SELECT id, sort_order FROM machines ORDER BY sort_order ASC")
            .all<{ id: string; sort_order: number }>()
        ).results ?? [];
      const index = rows.findIndex((row) => row.id === data.id);
      const target = rows[index + data.direction];
      const current = rows[index];
      if (current && target)
        await db.batch([
          db
            .prepare("UPDATE machines SET sort_order = ? WHERE id = ?")
            .bind(target.sort_order, current.id),
          db
            .prepare("UPDATE machines SET sort_order = ? WHERE id = ?")
            .bind(current.sort_order, target.id),
        ]);
    } else if (data.action === "updateSettings") await upsertSettings(db, data.settings);
    else if (data.action === "markEnquiry")
      await db
        .prepare("UPDATE enquiries SET read = ? WHERE id = ?")
        .bind(data.value ? 1 : 0, data.id)
        .run();
    else if (data.action === "resolveEnquiry")
      await db
        .prepare("UPDATE enquiries SET resolved = ? WHERE id = ?")
        .bind(data.value ? 1 : 0, data.id)
        .run();
    else if (data.action === "deleteEnquiry")
      await db.prepare("DELETE FROM enquiries WHERE id = ?").bind(data.id).run();
    else if (data.action === "reset") await seedDatabase(db);
    return readState(db);
  });

export const submitEnquiry = createServerFn({ method: "POST" })
  .validator(enquirySchema)
  .handler(async ({ data }) => {
    const key = getRequestIP({ xForwardedFor: true }) || "unknown";
    const now = Date.now();
    const limit = rateLimits.get(key);
    if (limit && limit.resetAt > now && limit.count >= 5)
      return {
        ok: false as const,
        saved: false,
        error: "Too many enquiries were sent. Please try again later or contact us on WhatsApp.",
      };
    rateLimits.set(
      key,
      !limit || limit.resetAt <= now
        ? { count: 1, resetAt: now + 10 * 60_000 }
        : { ...limit, count: limit.count + 1 },
    );

    const enquiry: Enquiry = {
      ...data,
      id: `enq-${crypto.randomUUID()}`,
      createdAt: new Date().toISOString(),
      read: false,
      resolved: false,
    };
    const db = getDb();
    if (db) {
      await ensureDatabase(db);
      await db
        .prepare(
          "INSERT INTO enquiries (id, name, company, phone, email, machine, requirement, created_at, read, resolved) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 0)",
        )
        .bind(
          enquiry.id,
          enquiry.name,
          enquiry.company,
          enquiry.phone,
          enquiry.email,
          enquiry.machine,
          enquiry.requirement,
          enquiry.createdAt,
        )
        .run();
    } else {
      const state = structuredClone(getMemoryState());
      state.enquiries.unshift(enquiry);
      setMemoryState(state);
    }

    const runtimeEnv = getRuntimeEnv();
    const apiKey = String(runtimeEnv["RESEND_API_KEY"] ?? "");
    const from = String(runtimeEnv["CONTACT_FROM_EMAIL"] ?? "");
    const to = String(
      runtimeEnv["CONTACT_TO_EMAILS"] ?? "infor.shiventerprise26@gmail.com,anil04172@gmail.com",
    )
      .split(",")
      .map((email) => email.trim())
      .filter(Boolean);
    if (!apiKey || !from)
      return {
        ok: true as const,
        saved: true,
        emailed: false,
        warning:
          "Your enquiry was saved, but email delivery is not configured yet. The team can still see it in Admin.",
      };

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to,
        reply_to: enquiry.email,
        subject: `New machinery enquiry — ${enquiry.machine || "General requirement"}`,
        html: enquiryEmailHtml(enquiry),
      }),
    });
    if (!response.ok)
      return {
        ok: true as const,
        saved: true,
        emailed: false,
        warning:
          "Your enquiry was saved, but the email notification could not be delivered. The team can still see it in Admin.",
      };
    return { ok: true as const, saved: true, emailed: true };
  });

async function normalizeOrder(db: D1Database) {
  const rows =
    (await db.prepare("SELECT id FROM machines ORDER BY sort_order ASC").all<{ id: string }>())
      .results ?? [];
  if (rows.length)
    await db.batch(
      rows.map((row, order) =>
        db.prepare("UPDATE machines SET sort_order = ? WHERE id = ?").bind(order, row.id),
      ),
    );
}

function moveInArray(machines: Machine[], id: string, direction: -1 | 1) {
  const index = machines.findIndex((machine) => machine.id === id);
  const target = index + direction;
  if (index >= 0 && target >= 0 && target < machines.length)
    [machines[index], machines[target]] = [machines[target]!, machines[index]!];
}

function slug(value: string) {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 48) || "machine"
  );
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>'"]/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ??
      character,
  );
}

function enquiryEmailHtml(enquiry: Enquiry) {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:8px 12px;font-weight:700;vertical-align:top">${label}</td><td style="padding:8px 12px">${escapeHtml(value || "—")}</td></tr>`;
  return `<div style="font-family:Arial,sans-serif;color:#262626"><h2 style="color:#f97316">New Shiv Enterprises enquiry</h2><table style="border-collapse:collapse">${row("Name", enquiry.name)}${row("Company", enquiry.company)}${row("Phone", enquiry.phone)}${row("Email", enquiry.email)}${row("Machine", enquiry.machine)}${row("Requirement", enquiry.requirement)}</table></div>`;
}
