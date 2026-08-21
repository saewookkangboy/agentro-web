import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const source = path.join(root, "dist", "public");
const target = path.join(root, "public");
const brandSource = path.join(root, "agentro_brand");
const brandTarget = path.join(target, "agentro_brand");

if (!fs.existsSync(path.join(source, "index.html"))) {
  console.error(
    `[sync-public] Missing ${source}/index.html — run vite build first`
  );
  process.exit(1);
}

fs.rmSync(target, { recursive: true, force: true });
fs.cpSync(source, target, { recursive: true });
console.log(`[sync-public] Copied ${source} → ${target}`);

if (!fs.existsSync(brandSource)) {
  console.warn(`[sync-public] Skipping brand kit — missing ${brandSource}`);
} else {
  fs.cpSync(brandSource, brandTarget, {
    recursive: true,
    filter: (src) => path.basename(src) !== ".DS_Store",
  });
  console.log(`[sync-public] Copied ${brandSource} → ${brandTarget}`);
}
