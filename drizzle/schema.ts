import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const siteSettings = mysqlTable("site_settings", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 96 }).notNull().unique(),
  value: text("value").notNull(),
  updatedBy: int("updatedBy"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const instructors = mysqlTable("instructors", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  name: varchar("name", { length: 160 }).notNull(),
  role: varchar("role", { length: 160 }).notNull(),
  intro: text("intro").notNull(),
  bio: text("bio").notNull(),
  photoUrl: text("photoUrl"),
  credentials: text("credentials").notNull(),
  tracks: text("tracks").notNull(),
  isPublished: int("isPublished").default(1).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const instructorItems = mysqlTable("instructor_items", {
  id: int("id").autoincrement().primaryKey(),
  instructorId: int("instructorId").notNull(),
  type: varchar("type", { length: 48 }).notNull(),
  title: varchar("title", { length: 220 }).notNull(),
  description: text("description").notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
});

export const programs = mysqlTable("programs", {
  id: int("id").autoincrement().primaryKey(),
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
  isPublished: int("isPublished").default(1).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
});

export const programSteps = mysqlTable("program_steps", {
  id: int("id").autoincrement().primaryKey(),
  programId: int("programId").notNull(),
  stepNumber: int("stepNumber").notNull(),
  title: varchar("title", { length: 180 }).notNull(),
  description: text("description").notNull(),
});

export const faqs = mysqlTable("faqs", {
  id: int("id").autoincrement().primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  isPublished: int("isPublished").default(1).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
});

export const webinarSettings = mysqlTable("webinar_settings", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 220 }).notNull(),
  subtitle: text("subtitle").notNull(),
  dateLabel: varchar("dateLabel", { length: 120 }).notNull(),
  benefits: text("benefits").notNull(),
  applicantCount: int("applicantCount").default(0).notNull(),
  isOpen: int("isOpen").default(1).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const webinarApplicants = mysqlTable("webinar_applicants", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  role: varchar("role", { length: 120 }),
  status: varchar("status", { length: 40 }).default("new").notNull(),
  consent: int("consent").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const auditLogs = mysqlTable("audit_logs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  action: varchar("action", { length: 120 }).notNull(),
  entity: varchar("entity", { length: 80 }).notNull(),
  entityId: int("entityId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Instructor = typeof instructors.$inferSelect;
export type Program = typeof programs.$inferSelect;
export type Faq = typeof faqs.$inferSelect;
export type WebinarApplicant = typeof webinarApplicants.$inferSelect;
