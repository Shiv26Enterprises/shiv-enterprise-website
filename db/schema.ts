import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const machines = sqliteTable("machines", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  caption: text("caption").notNull(),
  description: text("description").notNull(),
  available: integer("available", { mode: "boolean" }).notNull().default(true),
  image: text("image").notNull(),
  galleryJson: text("gallery_json").notNull().default("[]"),
  specsJson: text("specs_json").notNull().default("[]"),
  sortOrder: integer("sort_order").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const siteSettings = sqliteTable("site_settings", {
  id: integer("id").primaryKey(),
  businessName: text("business_name").notNull(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  whatsapp: text("whatsapp").notNull(),
  gst: text("gst").notNull(),
  marqueeEnabled: integer("marquee_enabled", { mode: "boolean" }).notNull().default(true),
  marqueeSpeed: text("marquee_speed").notNull().default("normal"),
  proofPointsJson: text("proof_points_json").notNull().default("[]"),
  updatedAt: text("updated_at").notNull(),
});

export const enquiries = sqliteTable("enquiries", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  company: text("company").notNull().default(""),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  machine: text("machine").notNull().default(""),
  requirement: text("requirement").notNull(),
  createdAt: text("created_at").notNull(),
  read: integer("read", { mode: "boolean" }).notNull().default(false),
  resolved: integer("resolved", { mode: "boolean" }).notNull().default(false),
});
