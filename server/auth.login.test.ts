import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { COOKIE_NAME } from "../shared/const";
import { ENV } from "./_core/env";
import type { TrpcContext } from "./_core/context";

const { upsertUserBestEffortMock } = vi.hoisted(() => ({
  upsertUserBestEffortMock: vi.fn(),
}));

vi.mock("./db", async importOriginal => {
  const actual = await importOriginal<typeof import("./db")>();
  return {
    ...actual,
    upsertUserBestEffort: upsertUserBestEffortMock,
  };
});

import { appRouter } from "./routers";

type CookieCall = {
  name: string;
  value: string;
  options: Record<string, unknown>;
};

function createLoginContext(): { ctx: TrpcContext; cookies: CookieCall[] } {
  const cookies: CookieCall[] = [];
  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: { "x-forwarded-proto": "https" },
    } as TrpcContext["req"],
    res: {
      cookie: (name: string, value: string, options: Record<string, unknown>) => {
        cookies.push({ name, value, options });
      },
    } as TrpcContext["res"],
  };
  return { ctx, cookies };
}

describe("auth.loginWithPassword", () => {
  const previousPassword = ENV.adminPassword;
  const previousAppId = ENV.appId;
  const previousSecret = ENV.cookieSecret;

  beforeEach(() => {
    ENV.adminPassword = "agentro-test-password";
    ENV.appId = "agentro-test-app";
    ENV.cookieSecret = "test-jwt-secret-value";
    upsertUserBestEffortMock.mockReset();
    upsertUserBestEffortMock.mockImplementation(() => undefined);
  });

  afterEach(() => {
    ENV.adminPassword = previousPassword;
    ENV.appId = previousAppId;
    ENV.cookieSecret = previousSecret;
  });

  it("still signs in when user persistence is best-effort only", async () => {
    const { ctx, cookies } = createLoginContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.loginWithPassword({
      password: "agentro-test-password",
    });

    expect(result).toEqual({ success: true });
    expect(upsertUserBestEffortMock).toHaveBeenCalledOnce();
    expect(cookies).toHaveLength(1);
    expect(cookies[0]?.name).toBe(COOKIE_NAME);
    expect(cookies[0]?.value.length).toBeGreaterThan(10);
    expect(cookies[0]?.options).toMatchObject({
      httpOnly: true,
      path: "/",
      sameSite: "none",
      secure: true,
    });
  });

  it("does not await hanging user persistence", async () => {
    upsertUserBestEffortMock.mockImplementation(() => {
      void new Promise(() => {
        /* never resolves — must not block login */
      });
    });
    const { ctx, cookies } = createLoginContext();
    const caller = appRouter.createCaller(ctx);

    const result = await Promise.race([
      caller.auth.loginWithPassword({ password: "agentro-test-password" }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("login hung on database")), 250)
      ),
    ]);

    expect(result).toEqual({ success: true });
    expect(cookies).toHaveLength(1);
  });
});
