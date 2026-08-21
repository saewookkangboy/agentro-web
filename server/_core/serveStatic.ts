import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { resolvePublicDir } from "./publicPath";

const STATIC_FILE_EXT = /\.(?:js|css|map|svg|png|jpe?g|gif|webp|ico|woff2?|ttf|txt|webmanifest|json)$/i;

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

  // fall through to index.html for SPA routes only — never for missing static assets
  app.use("*", (req, res) => {
    if (STATIC_FILE_EXT.test(req.path)) {
      res.status(404).type("text/plain").send("Not found");
      return;
    }
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
