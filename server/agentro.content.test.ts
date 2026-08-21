import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { toApplicantsCsv } from "./db";
import type { TrpcContext } from "./_core/context";

function context(role: "admin" | "user"): TrpcContext {
  return {
    user: { id: 9, openId: "test", email: "test@example.com", name: "Test", loginMethod: "manus", role, createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("Agentro content permissions", () => {
  it("allows public content reads without an authenticated user", async () => {
    const result = await appRouter.createCaller({ ...context("user"), user: undefined }).content.public();
    expect(result).toMatchObject({ settings: [], instructors: [], programs: [], faqs: [], webinar: null });
  });
  it("rejects admin content access for non-admin users", async () => {
    await expect(appRouter.createCaller(context("user")).admin.all()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
  it("quotes applicant CSV fields safely", () => {
    const csv = toApplicantsCsv([{ name: "홍길동", email: "h@example.com", role: "콘텐츠, 마케팅", status: "new", createdAt: new Date("2026-08-21T00:00:00Z") }]);
    expect(csv).toContain('"콘텐츠, 마케팅"');
    expect(csv.split("\n")).toHaveLength(2);
  });
});
