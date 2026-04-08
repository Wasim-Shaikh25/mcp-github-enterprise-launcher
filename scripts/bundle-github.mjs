#!/usr/bin/env node
/**
 * Copies your built github-mcp-server binary into vendor/ for publishing.
 *
 * Usage:
 *   node scripts/bundle-github.mjs <path-to-binary>
 *
 * Or set GITHUB_MCP_SERVER_SRC to the source file (no argv).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const vendor = path.join(root, "vendor");
fs.mkdirSync(vendor, { recursive: true });

const src = process.argv[2] || process.env.GITHUB_MCP_SERVER_SRC?.trim();
if (!src) {
  console.error(
    "Usage: node scripts/bundle-github.mjs <path-to-github-mcp-server-binary>\n" +
      "   or: GITHUB_MCP_SERVER_SRC=... node scripts/bundle-github.mjs"
  );
  process.exit(1);
}
if (!fs.existsSync(src)) {
  console.error(`Source not found: ${src}`);
  process.exit(1);
}

let destName;
if (process.platform === "win32") {
  destName = "github-mcp-server.exe";
} else if (process.platform === "darwin") {
  destName = "github-mcp-server-macos";
} else {
  destName = "github-mcp-server-linux";
}

const dest = path.join(vendor, destName);
fs.copyFileSync(src, dest);
try {
  fs.chmodSync(dest, 0o755);
} catch {
  /* Windows */
}
console.log(`Bundled: ${src} -> ${dest}`);
