#!/usr/bin/env node
/**
 * Removes import map entries whose /assets/... target files are missing.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const publicRoot = path.join(root, "public");
const indexPath = path.join(publicRoot, "index.html");

const html = fs.readFileSync(indexPath, "utf8");
const m = html.match(/<script type="importmap"[^>]*>([\s\S]*?)<\/script>/);
if (!m) throw new Error("importmap block not found");

const json = JSON.parse(m[1].trim());
const imports = { ...json.imports };
let removed = 0;

for (const [key, val] of Object.entries(imports)) {
  if (typeof val !== "string" || !val.startsWith("/assets/")) continue;
  const disk = path.join(publicRoot, val.replace(/^\//, ""));
  if (!fs.existsSync(disk)) {
    delete imports[key];
    removed++;
  }
}

json.imports = imports;
const inner = JSON.stringify(json, null, 2)
  .split("\n")
  .map((line) => "      " + line)
  .join("\n");

const newBlock = html.match(/<script type="importmap"[^>]*>/)[0] + "\n" + inner + "\n    </script>";
const newHtml = html.replace(/<script type="importmap"[^>]*>[\s\S]*?<\/script>/, newBlock);
fs.writeFileSync(indexPath, newHtml, "utf8");
console.log(`Removed ${removed} import map entries pointing at missing files.`);
