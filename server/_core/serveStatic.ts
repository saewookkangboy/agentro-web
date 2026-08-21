import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { resolvePublicDir } from "./publicPath";

export function serveStatic(app: Express) {
  const distPath = resolvePublicDir();
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  // On Vercel, files under public/ are served by the CDN; express.static is ignored.
  // Keep it for local/production Node deploys and SPA fallback via sendFile.
  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
