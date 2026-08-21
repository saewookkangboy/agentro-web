import fs from "fs";
import path from "path";

/** Resolve the built SPA directory across local, esbuild, and Vercel layouts. */
export function resolvePublicDir(): string {
  const candidates = [
    path.resolve(process.cwd(), "public"),
    path.resolve(process.cwd(), "dist/public"),
    path.resolve(import.meta.dirname, "public"),
    path.resolve(import.meta.dirname, "../../dist/public"),
    path.resolve(import.meta.dirname, "../../public"),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(path.join(candidate, "index.html"))) {
      return candidate;
    }
  }

  return candidates[0];
}

export function resolveIndexHtmlPath(): string {
  if (process.env.NODE_ENV === "development" && !process.env.VERCEL) {
    return path.resolve(import.meta.dirname, "../..", "client", "index.html");
  }
  return path.join(resolvePublicDir(), "index.html");
}
