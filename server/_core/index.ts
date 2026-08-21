import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import fs from "fs/promises";
import path from "path";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  const renderSocialPage = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const isWebinar = req.path === "/webinar";
      const isInstructor = req.path === "/instructors" || req.path.startsWith("/instructors/");
      if (!isWebinar && !isInstructor) return next();
      const forwardedProto = req.get("x-forwarded-proto")?.split(",")[0]?.trim() || req.protocol;
      const origin = `${forwardedProto}://${req.get("host")}`;
      const title = isWebinar
        ? "Agentro 웨비나 — 내 업무를 움직이는 AI 시스템의 첫 장면"
        : req.path === "/instructors"
          ? "Agentro 강사진 — 현업 언어로 시스템을 만드는 사람들"
          : "Agentro 강사 프로필 — 현업 언어로 시스템을 만드는 사람들";
      const description = isWebinar
        ? "60분 동안 경험하는 Agentro의 실무형 AI Agent 설계 방식. 웨비나 사전 신청 안내를 확인하세요."
        : "각자의 현업 언어로 업무를 시스템으로 바꾸는 Agentro 강사진을 소개합니다.";
      const image = `${origin}${isWebinar ? "/manus-storage/agentro-og-webinar_efbd44e7.svg" : "/manus-storage/agentro-og-instructor_fab88e98.svg"}`;
      const type = isWebinar ? "website" : "profile";
      const tags = `<meta property="og:title" content="${title}" /><meta property="og:description" content="${description}" /><meta property="og:type" content="${type}" /><meta property="og:url" content="${origin}${req.originalUrl}" /><meta property="og:image" content="${image}" /><meta property="og:image:width" content="1200" /><meta property="og:image:height" content="630" /><meta name="twitter:card" content="summary_large_image" /><meta name="twitter:title" content="${title}" /><meta name="twitter:description" content="${description}" /><meta name="twitter:image" content="${image}" />`;
      const indexPath = process.env.NODE_ENV === "development"
        ? path.resolve(import.meta.dirname, "../..", "client", "index.html")
        : path.resolve(import.meta.dirname, "public", "index.html");
      const template = await fs.readFile(indexPath, "utf-8");
      res.status(200).set({ "Content-Type": "text/html", "Cache-Control": "no-cache" }).send(template.replace("</head>", `${tags}</head>`));
    } catch (error) {
      next(error);
    }
  };
  app.get(["/webinar", "/instructors", "/instructors/:slug"], renderSocialPage);

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
