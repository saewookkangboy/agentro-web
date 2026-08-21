import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const source = path.join(root, "dist", "public");
const target = path.join(root, "public");

if (!fs.existsSync(path.join(source, "index.html"))) {
  console.error(
    `[sync-public] Missing ${source}/index.html — run vite build first`
  );
  process.exit(1);
}

fs.rmSync(target, { recursive: true, force: true });
fs.cpSync(source, target, { recursive: true });
console.log(`[sync-public] Copied ${source} → ${target}`);
