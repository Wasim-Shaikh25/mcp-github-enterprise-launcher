/**
 * Spawns the launcher for ~2s; expects the child to stay alive (MCP server waiting on stdio).
 */
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const launcher = path.join(root, "bin", "mcp-github-enterprise-launcher.mjs");

const p = spawn(process.execPath, [launcher], {
  cwd: root,
  env: {
    ...process.env,
    GITHUB_MCP_GH_HOST: process.env.GITHUB_MCP_GH_HOST || "https://github.disney.com/",
  },
  stdio: ["ignore", "pipe", "pipe"],
});

let stderr = "";
p.stderr.on("data", (d) => {
  stderr += d.toString();
});
p.stdout.on("data", () => {});

const t = setTimeout(() => {
  p.kill("SIGTERM");
}, 2500);

p.on("exit", (code, signal) => {
  clearTimeout(t);
  const ran =
    stderr.includes("GitHub MCP Server running") ||
    stderr.includes("running on stdio");
  const ok =
    signal === "SIGTERM" ||
    (code === null && signal) ||
    code === 143 ||
    (code === 0 && ran);
  if (ok) {
    console.log(
      "smoke-test OK: GitHub MCP started" +
        (code === 0 && ran ? " (clean exit after stdio closed)." : " (SIGTERM).")
    );
    process.exit(0);
  }
  console.error("smoke-test FAIL: unexpected exit", { code, signal });
  if (stderr) console.error(stderr.slice(-800));
  process.exit(1);
});

p.on("error", (err) => {
  console.error("smoke-test FAIL:", err.message);
  process.exit(1);
});
