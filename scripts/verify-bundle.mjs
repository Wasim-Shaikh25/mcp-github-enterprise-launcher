#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

if (process.env.SKIP_BUNDLE_CHECK === "1") {
  console.log("[verify-bundle] SKIP_BUNDLE_CHECK=1 — skipping vendor check.");
  process.exit(0);
}

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const vendor = path.join(root, "vendor");

function need(p) {
  if (!fs.existsSync(p)) {
    console.error(`[verify-bundle] Missing bundled binary: ${p}`);
    console.error(
      "Run: node scripts/bundle-github.mjs <path-to-your-github-mcp-server-binary>\n" +
        "Or set SKIP_BUNDLE_CHECK=1 to publish without vendor (not recommended for end users)."
    );
    process.exit(1);
  }
}

if (process.platform === "win32") {
  need(path.join(vendor, "github-mcp-server.exe"));
} else if (process.platform === "darwin") {
  need(path.join(vendor, "github-mcp-server-macos"));
} else {
  need(path.join(vendor, "github-mcp-server-linux"));
}

console.log("[verify-bundle] GitHub MCP vendor binary OK.");
