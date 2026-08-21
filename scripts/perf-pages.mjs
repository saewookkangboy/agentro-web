/**
 * One-shot page correctness + performance probe for Agentro.
 * Usage: BASE_URL=... SHARE_URL=... node scripts/perf-pages.mjs
 */
import { chromium } from "playwright";
import fs from "node:fs";

const BASE = (process.env.BASE_URL || "http://127.0.0.1:3000").replace(/\/$/, "");
const SHARE = process.env.SHARE_URL || "";
const OUT = process.env.OUT_JSON || "/tmp/agentro-perf-results.json";

const ROUTES = [
  { path: "/", expect: ["Agentro", "AI"] },
  { path: "/webinar", expect: ["웨비나", "신청"] },
  { path: "/instructors", expect: ["강사"] },
  { path: "/instructors/instructor-a", expect: ["강사", "프로필"] },
  { path: "/programs", expect: ["프로그램"] },
  { path: "/programs/agent-builder", expect: ["Agent", "프로그램"] },
  { path: "/admin", expect: ["Sign in", "콘텐츠", "운영", "CONTROL"] },
  { path: "/admin/content", expect: ["Sign in", "콘텐츠", "홈"] },
  { path: "/404-missing-route", expect: ["404", "없", "Not", "찾"] },
];

function pickPaint(entries, name) {
  const hit = entries.find((e) => e.name === name);
  return hit ? Math.round(hit.startTime) : null;
}

async function measure(page, path, expectTokens) {
  const url = `${BASE}${path}`;
  const consoleErrors = [];
  const pageErrors = [];
  const failedRequests = [];

  const onConsole = (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text().slice(0, 300));
  };
  const onPageError = (err) => pageErrors.push(String(err).slice(0, 300));
  const onFailed = (req) => {
    const res = req.failure();
    failedRequests.push({
      url: req.url().slice(0, 200),
      error: res?.errorText || "failed",
    });
  };

  page.on("console", onConsole);
  page.on("pageerror", onPageError);
  page.on("requestfailed", onFailed);

  const started = Date.now();
  let response;
  try {
    response = await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
  } catch (e) {
    page.off("console", onConsole);
    page.off("pageerror", onPageError);
    page.off("requestfailed", onFailed);
    return {
      path,
      url,
      ok: false,
      status: null,
      error: String(e).slice(0, 400),
      durationMs: Date.now() - started,
    };
  }

  // Give React a beat to hydrate / query, and wait briefly for LCP
  await page.waitForTimeout(800);
  await page.evaluate(() => {
    return new Promise((resolve) => {
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        resolve(null);
      };
      try {
        const po = new PerformanceObserver((list) => {
          if (list.getEntries().length) finish();
        });
        po.observe({ type: "largest-contentful-paint", buffered: true });
      } catch {
        finish();
        return;
      }
      setTimeout(finish, 2500);
    });
  });

  const metrics = await page.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0];
    const paints = performance.getEntriesByType("paint").map((p) => ({
      name: p.name,
      startTime: p.startTime,
    }));
    const resources = performance.getEntriesByType("resource");
    const transfer = resources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
    const docTransfer = nav ? nav.transferSize || 0 : 0;
    const lcpEntries = performance.getEntriesByType("largest-contentful-paint");
    const lcp = lcpEntries.length
      ? lcpEntries[lcpEntries.length - 1].startTime
      : null;
    const title = document.title;
    const h1 = document.querySelector("h1")?.textContent?.trim() || "";
    const bodyText = (document.body?.innerText || "").slice(0, 4000);
    const hasRoot = Boolean(document.getElementById("root") || document.querySelector("#root"));
    return {
      title,
      h1,
      bodyText,
      hasRoot,
      ttfb: nav ? Math.round(nav.responseStart) : null,
      domContentLoaded: nav ? Math.round(nav.domContentLoadedEventEnd) : null,
      load: nav ? Math.round(nav.loadEventEnd) : null,
      transferBytes: transfer + docTransfer,
      resourceCount: resources.length,
      paints,
      lcp: lcp != null ? Math.round(lcp) : null,
      readyState: document.readyState,
    };
  });

  page.off("console", onConsole);
  page.off("pageerror", onPageError);
  page.off("requestfailed", onFailed);

  const status = response?.status() ?? null;
  const hay = `${metrics.title}\n${metrics.h1}\n${metrics.bodyText}`;
  const matched = expectTokens.filter((t) => hay.includes(t));
  const contentOk = matched.length > 0;
  const looksLikeSso =
    /vercel\.com\/sso|Authentication Required|Vercel Authentication/i.test(hay) ||
    /login\.vercel\.com/i.test(page.url());

  const fcp = pickPaint(metrics.paints, "first-contentful-paint");
  const fp = pickPaint(metrics.paints, "first-paint");

  const ok =
    status != null &&
    status < 400 &&
    contentOk &&
    !looksLikeSso &&
    pageErrors.length === 0;

  return {
    path,
    url: page.url(),
    ok,
    status,
    contentOk,
    matchedExpect: matched,
    looksLikeSso,
    title: metrics.title,
    h1: metrics.h1.slice(0, 120),
    ttfbMs: metrics.ttfb,
    fcpMs: fcp,
    fpMs: fp,
    lcpMs: metrics.lcp,
    dclMs: metrics.domContentLoaded,
    loadMs: metrics.load,
    transferKB: Math.round((metrics.transferBytes / 1024) * 10) / 10,
    resourceCount: metrics.resourceCount,
    consoleErrorCount: consoleErrors.length,
    consoleErrors: consoleErrors.slice(0, 5),
    pageErrors: pageErrors.slice(0, 5),
    failedRequestCount: failedRequests.length,
    failedRequests: failedRequests.slice(0, 8),
    durationMs: Date.now() - started,
  };
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    serviceWorkers: "block",
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 AgentroPerfBot/1.0",
  });
  await context.route("**/*", async (route) => {
    const headers = {
      ...route.request().headers(),
      "cache-control": "no-cache",
      pragma: "no-cache",
    };
    await route.continue({ headers });
  });
  const page = await context.newPage();
  await page.addInitScript(() => {
    try {
      performance.clearResourceTimings();
    } catch {}
  });

  if (SHARE) {
    const shareRes = await page.goto(SHARE, {
      waitUntil: "networkidle",
      timeout: 60000,
    });
    console.error(
      `[share] status=${shareRes?.status()} final=${page.url().slice(0, 120)}`
    );
    await page.waitForTimeout(800);
  }

  const results = [];
  for (const route of ROUTES) {
    const row = await measure(page, route.path, route.expect);
    results.push(row);
    console.error(
      `[${row.ok ? "OK" : "FAIL"}] ${route.path} status=${row.status} ttfb=${row.ttfbMs} fcp=${row.fcpMs} lcp=${row.lcpMs} load=${row.loadMs}`
    );
  }

  // Mobile pass on home only
  await context.close();
  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  });
  const mpage = await mobile.newPage();
  if (SHARE) {
    await mpage.goto(SHARE, { waitUntil: "networkidle", timeout: 60000 });
    await mpage.waitForTimeout(600);
  }
  const mobileHome = await measure(mpage, "/", ["Agentro", "AI"]);
  mobileHome.path = "/ (mobile 390px)";
  results.push(mobileHome);
  console.error(
    `[${mobileHome.ok ? "OK" : "FAIL"}] mobile home ttfb=${mobileHome.ttfbMs} fcp=${mobileHome.fcpMs} lcp=${mobileHome.lcpMs}`
  );

  await browser.close();

  const summary = {
    base: BASE,
    testedAt: new Date().toISOString(),
    passCount: results.filter((r) => r.ok).length,
    failCount: results.filter((r) => !r.ok).length,
    results,
  };
  fs.writeFileSync(OUT, JSON.stringify(summary, null, 2));
  console.log(JSON.stringify(summary));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
