import { and, asc, desc, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { ENV, LOCAL_ADMIN_OPEN_ID } from "./_core/env";
import {
  auditLogs,
  faqs,
  instructorItems,
  instructors,
  programs,
  programSteps,
  siteSettings,
  users,
  webinarApplicants,
  webinarSettings,
  type InsertUser,
  type User,
} from "../drizzle/schema";

let _client: ReturnType<typeof postgres> | null = null;
let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      // Fail fast on Vercel: unreachable DB previously hung login for up to 300s.
      _client = postgres(process.env.DATABASE_URL, {
        prepare: false,
        max: 1,
        connect_timeout: 5,
        idle_timeout: 20,
        max_lifetime: 60 * 5,
      });
      _db = drizzle(_client);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
      _client = null;
    }
  }
  return _db;
}

/** Persist user without blocking the request when the database is slow/down. */
export function upsertUserBestEffort(user: InsertUser): void {
  void upsertUser(user).catch(error => {
    console.warn("[Database] Best-effort user upsert failed:", error);
  });
}

export function buildLocalAdminUser(): User {
  const now = new Date();
  return {
    id: 1,
    openId: LOCAL_ADMIN_OPEN_ID,
    name: "Agentro Admin",
    email: null,
    loginMethod: "password",
    role: "admin",
    createdAt: now,
    updatedAt: now,
    lastSignedIn: now,
  };
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  for (const field of ["name", "email", "loginMethod"] as const) {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  }
  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId || user.openId === LOCAL_ADMIN_OPEN_ID) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (!Object.keys(updateSet).length) updateSet.lastSignedIn = new Date();
  await db
    .insert(users)
    .values(values)
    .onConflictDoUpdate({ target: users.openId, set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  if (openId === LOCAL_ADMIN_OPEN_ID) {
    const db = await getDb();
    if (!db) return buildLocalAdminUser();
  }
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function getPublicContent() {
  const empty = { settings: [], instructors: [], programs: [], faqs: [], webinar: null as null };
  const db = await getDb();
  if (!db) return empty;
  const [settings, publishedInstructors, publishedPrograms, publishedFaqs, webinar] =
    await Promise.all([
      db.select().from(siteSettings),
      db
        .select()
        .from(instructors)
        .where(eq(instructors.isPublished, 1))
        .orderBy(asc(instructors.sortOrder)),
      db
        .select()
        .from(programs)
        .where(eq(programs.isPublished, 1))
        .orderBy(asc(programs.sortOrder)),
      db.select().from(faqs).where(eq(faqs.isPublished, 1)).orderBy(asc(faqs.sortOrder)),
      db.select().from(webinarSettings).limit(1),
    ]);
  return {
    settings,
    instructors: publishedInstructors,
    programs: publishedPrograms,
    faqs: publishedFaqs,
    webinar: webinar[0] ?? null,
  };
}

export async function getAllAdminContent() {
  const empty = {
    settings: [],
    instructors: [],
    instructorItems: [],
    programs: [],
    programSteps: [],
    faqs: [],
    webinar: null as null,
    applicants: [],
  };
  const db = await getDb();
  if (!db) return empty;
  const [
    settings,
    instructorRows,
    itemRows,
    programRows,
    stepRows,
    faqRows,
    webinarRows,
    applicants,
  ] = await Promise.all([
    db.select().from(siteSettings).orderBy(asc(siteSettings.key)),
    db.select().from(instructors).orderBy(asc(instructors.sortOrder)),
    db.select().from(instructorItems).orderBy(asc(instructorItems.sortOrder)),
    db.select().from(programs).orderBy(asc(programs.sortOrder)),
    db.select().from(programSteps).orderBy(asc(programSteps.stepNumber)),
    db.select().from(faqs).orderBy(asc(faqs.sortOrder)),
    db.select().from(webinarSettings).limit(1),
    db.select().from(webinarApplicants).orderBy(desc(webinarApplicants.createdAt)),
  ]);
  return {
    settings,
    instructors: instructorRows,
    instructorItems: itemRows,
    programs: programRows,
    programSteps: stepRows,
    faqs: faqRows,
    webinar: webinarRows[0] ?? null,
    applicants,
  };
}

export async function saveSetting(key: string, value: string, updatedBy: number) {
  const db = await getDb();
  if (!db) return;
  await db
    .insert(siteSettings)
    .values({ key, value, updatedBy })
    .onConflictDoUpdate({
      target: siteSettings.key,
      set: { value, updatedBy, updatedAt: new Date() },
    });
}

export async function saveAudit(
  userId: number,
  action: string,
  entity: string,
  entityId?: number
) {
  const db = await getDb();
  if (db) await db.insert(auditLogs).values({ userId, action, entity, entityId });
}

export async function registerWebinarApplicant(input: {
  name: string;
  email: string;
  role?: string;
  consent: boolean;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.insert(webinarApplicants).values({
    ...input,
    role: input.role ?? null,
    consent: input.consent ? 1 : 0,
  });
  await db
    .update(webinarSettings)
    .set({ applicantCount: sql`${webinarSettings.applicantCount} + 1` });
}

export function toApplicantsCsv(
  rows: Array<{
    name: string;
    email: string;
    role?: string | null;
    status: string;
    createdAt: Date;
  }>
) {
  const esc = (v: unknown) => `"${String(v ?? "").replaceAll('"', '""')}"`;
  return [
    "name,email,role,status,createdAt",
    ...rows.map(r =>
      [r.name, r.email, r.role, r.status, r.createdAt.toISOString()].map(esc).join(",")
    ),
  ].join("\n");
}

export async function applicantsCsv() {
  const db = await getDb();
  if (!db) return "name,email,role,status,createdAt\n";
  const rows = await db
    .select()
    .from(webinarApplicants)
    .orderBy(desc(webinarApplicants.createdAt));
  return toApplicantsCsv(rows);
}

export async function findInstructor(slug: string) {
  const db = await getDb();
  if (!db) return null;
  const row = (
    await db
      .select()
      .from(instructors)
      .where(and(eq(instructors.slug, slug), eq(instructors.isPublished, 1)))
      .limit(1)
  )[0];
  if (!row) return null;
  const items = await db
    .select()
    .from(instructorItems)
    .where(eq(instructorItems.instructorId, row.id))
    .orderBy(asc(instructorItems.sortOrder));
  return { ...row, items };
}

export async function findProgram(slug: string) {
  const db = await getDb();
  if (!db) return null;
  const row = (
    await db
      .select()
      .from(programs)
      .where(and(eq(programs.slug, slug), eq(programs.isPublished, 1)))
      .limit(1)
  )[0];
  if (!row) return null;
  const steps = await db
    .select()
    .from(programSteps)
    .where(eq(programSteps.programId, row.id))
    .orderBy(asc(programSteps.stepNumber));
  return { ...row, steps };
}
