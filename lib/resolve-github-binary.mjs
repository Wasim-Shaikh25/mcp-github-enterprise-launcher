import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const pkgRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Vendor layout (place files before npm publish):
 *   vendor/github-mcp-server.exe     — Windows
 *   vendor/github-mcp-server-linux   — Linux (chmod +x)
 *   vendor/github-mcp-server-macos   — macOS (chmod +x)
 */
export function bundledGithubBinaryPath() {
  if (process.platform === "win32") {
    return path.join(pkgRoot, "vendor", "github-mcp-server.exe");
  }
  if (process.platform === "darwin") {
    return path.join(pkgRoot, "vendor", "github-mcp-server-macos");
  }
  return path.join(pkgRoot, "vendor", "github-mcp-server-linux");
}

export function resolveGithubMcpBinary() {
  const fromEnv = process.env.GITHUB_MCP_SERVER_PATH?.trim();
  if (fromEnv) return fromEnv;
  const bundled = bundledGithubBinaryPath();
  if (fs.existsSync(bundled)) return bundled;
  return null;
}
