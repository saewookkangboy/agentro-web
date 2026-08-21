import { z } from "zod";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "../shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { getAllAdminContent, getDb, getPublicContent, findInstructor, findProgram, registerWebinarApplicant, applicantsCsv, saveAudit, saveSetting } from "./db";
import { faqs, instructorItems, instructors, programs, programSteps, webinarSettings, webinarApplicants } from "../drizzle/schema";
import { storagePut } from "./storage";
import { notifyOwner } from "./_core/notification";

const instructorInput = z.object({ id: z.number().optional(), slug: z.string().min(2), name: z.string().min(1), role: z.string().min(1), intro: z.string(), bio: z.string(), photoUrl: z.string().optional().nullable(), credentials: z.string(), tracks: z.string(), isPublished: z.boolean(), sortOrder: z.number().default(0) });
const programInput = z.object({ id: z.number().optional(), slug: z.string().min(2), track: z.string(), title: z.string(), promise: z.string(), description: z.string(), price: z.string(), schedule: z.string(), deliveryMode: z.string(), status: z.string(), outcomes: z.string(), isPublished: z.boolean(), sortOrder: z.number().default(0) });

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => { const cookieOptions = getSessionCookieOptions(ctx.req); ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 }); return { success: true } as const; }),
  }),
  content: router({
    public: publicProcedure.query(() => getPublicContent()),
    instructor: publicProcedure.input(z.object({ slug: z.string() })).query(({ input }) => findInstructor(input.slug)),
    program: publicProcedure.input(z.object({ slug: z.string() })).query(({ input }) => findProgram(input.slug)),
    registerWebinar: publicProcedure.input(z.object({ name: z.string().min(1), email: z.string().email(), role: z.string().optional(), consent: z.literal(true) })).mutation(async ({ input }) => {
      try {
        await registerWebinarApplicant(input);
      } catch (error) {
        const message = error instanceof Error ? error.message : "등록에 실패했습니다.";
        if (message.includes("Database unavailable")) {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "신청 시스템을 준비 중입니다. 잠시 후 다시 시도해 주세요.",
          });
        }
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "신청 처리 중 오류가 발생했습니다." });
      }
      await notifyOwner({ title: "새 웨비나 사전 신청", content: `${input.name} (${input.email})님이 웨비나를 신청했습니다.` });
      return { success: true } as const;
    }),
  }),
  admin: router({
    all: adminProcedure.query(() => getAllAdminContent()),
    setting: adminProcedure.input(z.object({ key: z.string(), value: z.string() })).mutation(async ({ input, ctx }) => { await saveSetting(input.key, input.value, ctx.user.id); await saveAudit(ctx.user.id, "update", "site_setting"); return { success: true } as const; }),
    instructor: router({
      save: adminProcedure.input(instructorInput).mutation(async ({ input, ctx }) => { const db = await getDb(); if (!db) throw new Error("Database unavailable"); const values = { slug: input.slug, name: input.name, role: input.role, intro: input.intro, bio: input.bio, photoUrl: input.photoUrl ?? null, credentials: input.credentials, tracks: input.tracks, isPublished: input.isPublished ? 1 : 0, sortOrder: input.sortOrder }; if (input.id) await db.update(instructors).set(values).where(eq(instructors.id, input.id)); else await db.insert(instructors).values(values); await saveAudit(ctx.user.id, input.id ? "update" : "create", "instructor", input.id); return { success: true } as const; }),
      delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input, ctx }) => { const db = await getDb(); if (db) { await db.delete(instructorItems).where(eq(instructorItems.instructorId, input.id)); await db.delete(instructors).where(eq(instructors.id, input.id)); await saveAudit(ctx.user.id, "delete", "instructor", input.id); } return { success: true } as const; }),
      saveItem: adminProcedure.input(z.object({ id: z.number().optional(), instructorId: z.number(), type: z.string(), title: z.string(), description: z.string(), sortOrder: z.number().default(0) })).mutation(async ({ input, ctx }) => { const db = await getDb(); if (!db) throw new Error("Database unavailable"); const values = { instructorId: input.instructorId, type: input.type, title: input.title, description: input.description, sortOrder: input.sortOrder }; if (input.id) await db.update(instructorItems).set(values).where(eq(instructorItems.id, input.id)); else await db.insert(instructorItems).values(values); await saveAudit(ctx.user.id, input.id ? "update" : "create", "instructor_item", input.id); return { success: true } as const; }),
      uploadPhoto: adminProcedure.input(z.object({ filename: z.string(), contentType: z.string(), dataBase64: z.string() })).mutation(async ({ input }) => { const buffer = Buffer.from(input.dataBase64, "base64"); return storagePut(`agentro/instructors/${input.filename}`, buffer, input.contentType); }),
    }),
    program: router({
      save: adminProcedure.input(programInput).mutation(async ({ input, ctx }) => { const db = await getDb(); if (!db) throw new Error("Database unavailable"); const values = { slug: input.slug, track: input.track, title: input.title, promise: input.promise, description: input.description, price: input.price, schedule: input.schedule, deliveryMode: input.deliveryMode, status: input.status, outcomes: input.outcomes, isPublished: input.isPublished ? 1 : 0, sortOrder: input.sortOrder }; if (input.id) await db.update(programs).set(values).where(eq(programs.id, input.id)); else await db.insert(programs).values(values); await saveAudit(ctx.user.id, input.id ? "update" : "create", "program", input.id); return { success: true } as const; }),
      delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input, ctx }) => { const db = await getDb(); if (db) { await db.delete(programSteps).where(eq(programSteps.programId, input.id)); await db.delete(programs).where(eq(programs.id, input.id)); await saveAudit(ctx.user.id, "delete", "program", input.id); } return { success: true } as const; }),
      saveStep: adminProcedure.input(z.object({ id: z.number().optional(), programId: z.number(), stepNumber: z.number(), title: z.string(), description: z.string() })).mutation(async ({ input }) => { const db = await getDb(); if (!db) throw new Error("Database unavailable"); const values = { programId: input.programId, stepNumber: input.stepNumber, title: input.title, description: input.description }; if (input.id) await db.update(programSteps).set(values).where(eq(programSteps.id, input.id)); else await db.insert(programSteps).values(values); return { success: true } as const; }),
    }),
    faq: router({
      save: adminProcedure.input(z.object({ id: z.number().optional(), question: z.string(), answer: z.string(), isPublished: z.boolean(), sortOrder: z.number().default(0) })).mutation(async ({ input, ctx }) => { const db = await getDb(); if (!db) throw new Error("Database unavailable"); const values = { question: input.question, answer: input.answer, isPublished: input.isPublished ? 1 : 0, sortOrder: input.sortOrder }; if (input.id) await db.update(faqs).set(values).where(eq(faqs.id, input.id)); else await db.insert(faqs).values(values); await saveAudit(ctx.user.id, input.id ? "update" : "create", "faq", input.id); return { success: true } as const; }),
      delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => { const db = await getDb(); if (db) await db.delete(faqs).where(eq(faqs.id, input.id)); return { success: true } as const; }),
    }),
    webinar: router({
      save: adminProcedure.input(z.object({ title: z.string(), subtitle: z.string(), dateLabel: z.string(), benefits: z.string(), isOpen: z.boolean() })).mutation(async ({ input }) => { const db = await getDb(); if (!db) throw new Error("Database unavailable"); const values = { title: input.title, subtitle: input.subtitle, dateLabel: input.dateLabel, benefits: input.benefits, isOpen: input.isOpen ? 1 : 0 }; const existing = await db.select().from(webinarSettings).limit(1); if (existing[0]) await db.update(webinarSettings).set(values).where(eq(webinarSettings.id, existing[0].id)); else await db.insert(webinarSettings).values(values); return { success: true } as const; }),
      status: adminProcedure.input(z.object({ id: z.number(), status: z.string() })).mutation(async ({ input }) => { const db = await getDb(); if (db) await db.update(webinarApplicants).set({ status: input.status }).where(eq(webinarApplicants.id, input.id)); return { success: true } as const; }),
      csv: adminProcedure.query(() => applicantsCsv()),
    }),
  }),
});

export type AppRouter = typeof appRouter;
