import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("agentro_user_role", ["user", "admin"]);

export const users = pgTable("agentro_users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: userRoleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignedIn: timestamp("lastSignedIn", { withTimezone: true }).defaultNow().notNull(),
});

export const siteSettings = pgTable("agentro_site_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 96 }).notNull().unique(),
  value: text("value").notNull(),
  updatedBy: integer("updatedBy"),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const instructors = pgTable("agentro_instructors", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  name: varchar("name", { length: 160 }).notNull(),
  role: varchar("role", { length: 160 }).notNull(),
  intro: text("intro").notNull(),
  bio: text("bio").notNull(),
  photoUrl: text("photoUrl"),
  credentials: text("credentials").notNull(),
  tracks: text("tracks").notNull(),
  isPublished: integer("isPublished").default(1).notNull(),
  sortOrder: integer("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const instructorItems = pgTable("agentro_instructor_items", {
  id: serial("id").primaryKey(),
  instructorId: integer("instructorId").notNull(),
  type: varchar("type", { length: 48 }).notNull(),
  title: varchar("title", { length: 220 }).notNull(),
  description: text("description").notNull(),
  sortOrder: integer("sortOrder").default(0).notNull(),
});

export const programs = pgTable("agentro_programs", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  track: varchar("track", { length: 80 }).notNull(),
  title: varchar("title", { length: 220 }).notNull(),
  promise: text("promise").notNull(),
  description: text("description").notNull(),
  price: varchar("price", { length: 80 }).notNull(),
  schedule: varchar("schedule", { length: 160 }).notNull(),
  deliveryMode: varchar("deliveryMode", { length: 80 }).notNull(),
  status: varchar("status", { length: 32 }).default("open").notNull(),
  outcomes: text("outcomes").notNull(),
  isPublished: integer("isPublished").default(1).notNull(),
  sortOrder: integer("sortOrder").default(0).notNull(),
});

export const programSteps = pgTable("agentro_program_steps", {
  id: serial("id").primaryKey(),
  programId: integer("programId").notNull(),
  stepNumber: integer("stepNumber").notNull(),
  title: varchar("title", { length: 180 }).notNull(),
  description: text("description").notNull(),
});

export const faqs = pgTable("agentro_faqs", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  isPublished: integer("isPublished").default(1).notNull(),
  sortOrder: integer("sortOrder").default(0).notNull(),
});

export const webinarSettings = pgTable("agentro_webinar_settings", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 220 }).notNull(),
  subtitle: text("subtitle").notNull(),
  dateLabel: varchar("dateLabel", { length: 120 }).notNull(),
  benefits: text("benefits").notNull(),
  applicantCount: integer("applicantCount").default(0).notNull(),
  isOpen: integer("isOpen").default(1).notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const webinarApplicants = pgTable("agentro_webinar_applicants", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  role: varchar("role", { length: 120 }),
  status: varchar("status", { length: 40 }).default("new").notNull(),
  consent: integer("consent").default(0).notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const auditLogs = pgTable("agentro_audit_logs", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  action: varchar("action", { length: 120 }).notNull(),
  entity: varchar("entity", { length: 80 }).notNull(),
  entityId: integer("entityId"),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Instructor = typeof instructors.$inferSelect;
export type Program = typeof programs.$inferSelect;
export type Faq = typeof faqs.$inferSelect;
export type WebinarApplicant = typeof webinarApplicants.$inferSelect;
