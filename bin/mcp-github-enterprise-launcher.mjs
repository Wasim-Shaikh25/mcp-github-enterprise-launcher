#!/usr/bin/env node
/**
 * Spawns the GitHub MCP server binary with stdio connected to this process.
 *
 * Binary resolution (first match wins):
 *   1. GITHUB_MCP_SERVER_PATH — explicit path
 *   2. Bundled file under package vendor/ (shipped with npm)
 *
 * Optional:
 *   GITHUB_MCP_GH_HOST — enterprise API host (default https://github.com/)
 *   GH_HOST — alias for GITHUB_MCP_GH_HOST
 *   GITHUB_MCP_TOOLSETS — comma list (default repos,issues,pull_requests)
 *   GITHUB_MCP_READ_ONLY — if "0" or "false", omits --read-only
 *
 * CLI args after the script replace the default child argv list entirely.
 */
import { spawn } from "node:child_process";
import process from "node:process";
import { resolveGithubMcpBinary } from "../lib/resolve-github-binary.mjs";

const exe = resolveGithubMcpBinary();
if (!exe) {
  console.error(
    "[mcp-github-enterprise-launcher] No GitHub MCP binary found. Install a published package that includes vendor/, or set GITHUB_MCP_SERVER_PATH."
  );
  process.exit(1);
}

const userArgs = process.argv.slice(2);
let childArgs;
if (userArgs.length > 0) {
  childArgs = userArgs;
} else {
  const host = (
    process.env.GITHUB_MCP_GH_HOST ||
    process.env.GH_HOST ||
    "https://github.com/"
  ).replace(/\/?$/, "/");
  const toolsets =
    process.env.GITHUB_MCP_TOOLSETS || "repos,issues,pull_requests";
  const readOnly = !/^0|false$/i.test(
    String(process.env.GITHUB_MCP_READ_ONLY ?? "true")
  );
  childArgs = ["stdio"];
  if (readOnly) childArgs.push("--read-only");
  childArgs.push("--toolsets", toolsets, "--gh-host", host);
}

const child = spawn(exe, childArgs, {
  stdio: "inherit",
  env: process.env,
  windowsHide: true,
  shell: false,
});

function forward(sig) {
  try {
    child.kill(sig);
  } catch {
    /* ignore */
  }
}
for (const sig of ["SIGINT", "SIGTERM"]) {
  process.on(sig, () => forward(sig));
}

child.on("error", (err) => {
  console.error("[mcp-github-enterprise-launcher]", err.message);
  process.exit(1);
});

child.on("exit", (code, signal) => {
  if (signal) process.exit(1);
  process.exit(code ?? 1);
});
