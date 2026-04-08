# mcp-github-enterprise-launcher

Node.js **stdio launcher** for a **GitHub Enterprise MCP server** binary (for example a `github-mcp-server` executable). Publish it to npm so teams can run **`npx mcp-github-enterprise-launcher`** with env only, or ship the binary inside **`vendor/`** so consumers do not need a separate install path.

---

## See also (sibling projects)

| Project | Purpose |
|---------|---------|
| **SonarQube MCP launcher** | [mcp-sonarqube-launcher](https://github.com/Wasim-Shaikh25/mcp-sonarqube-launcher) — same pattern for a SonarQube MCP **`.jar`**. |
| **Jira MCP** | npm [`@svasimahmed283/jira-mcp-oauth`](https://www.npmjs.com/package/@svasimahmed283/jira-mcp-oauth) — full MCP server for Jira. |
| **Confluence MCP** | npm [`@svasimahmed283/confluence-sso-mcp`](https://www.npmjs.com/package/@svasimahmed283/confluence-sso-mcp) — full MCP server for Confluence. |

---

## Prerequisites

| Requirement | Notes |
|-------------|--------|
| **Node.js 18+** | Required to run this launcher. |
| **GitHub MCP binary** | Built separately (or supplied by your org). This package only **spawns** it unless you publish with **`vendor/`**. |
| **`GITHUB_PERSONAL_ACCESS_TOKEN`** | Required by the upstream server for API access; set in MCP **`env`** (never commit). |

---

## Quick start (end users)

### A — Binary bundled in npm (`vendor/`)

After your team publishes a tarball that includes **`vendor/github-mcp-server.exe`** (Windows) or **`vendor/github-mcp-server-linux`** / **`github-mcp-server-macos`**, Cursor can use:

```json
"github-enterprise": {
  "command": "npx",
  "args": ["--yes", "mcp-github-enterprise-launcher"],
  "env": {
    "GITHUB_MCP_GH_HOST": "https://github.mycompany.com/",
    "GITHUB_PERSONAL_ACCESS_TOKEN": "<secret>"
  }
}
```

No **`GITHUB_MCP_SERVER_PATH`** is needed when the correct file exists under **`vendor/`**.

### B — Binary only on disk (no bundle)

Set an explicit path:

```json
"env": {
  "GITHUB_MCP_SERVER_PATH": "C:\\\\tools\\\\github-mcp-server.exe",
  "GITHUB_MCP_GH_HOST": "https://github.mycompany.com/",
  "GITHUB_PERSONAL_ACCESS_TOKEN": "<secret>"
}
```

### CLI args override

If you pass **any** arguments after the launcher script, they **replace** the default child argv (same as listing **`args`** in older configs: `stdio`, `--read-only`, `--toolsets`, …).

---

## Maintainer workflow

| Step | Command |
|------|---------|
| Copy binary into **`vendor/`** | `node scripts/bundle-github.mjs C:\path\to\github-mcp-server.exe` |
| Verify before publish | `node scripts/verify-bundle.mjs` (runs in **`prepublishOnly`**) |
| Skip check (dry pack only) | `set SKIP_BUNDLE_CHECK=1` then **`npm pack`** |
| Smoke test (needs **`GITHUB_PERSONAL_ACCESS_TOKEN`**) | `npm run smoke-test` |
| Publish | `npm publish --access public` (use a **scoped** name if the unscoped name is taken) |

**Multi-OS:** To ship one npm version for Windows + Linux + macOS, run **`bundle-github.mjs`** on each platform (or copy CI artifacts) so all expected filenames exist under **`vendor/`** before a single **`npm publish`**. The launcher selects the file for **`process.platform`** at runtime.

**Git:** Large binaries under **`vendor/`** are **gitignored** (except **`vendor/README.md`**). The tarball for **`npm publish`** still includes **`vendor/`** if those files exist on disk when you pack.

---

## Environment

| Variable | Description |
|----------|-------------|
| `GITHUB_MCP_SERVER_PATH` | Overrides bundled binary path. |
| `GITHUB_MCP_GH_HOST` / `GH_HOST` | GitHub Enterprise host URL (default `https://github.com/`). |
| `GITHUB_MCP_TOOLSETS` | Comma list (default `repos,issues,pull_requests`). |
| `GITHUB_MCP_READ_ONLY` | Default `true`; set `0` or `false` to omit `--read-only`. |
| `GITHUB_PERSONAL_ACCESS_TOKEN` | Passed through to the child process (set in MCP host **`env`**). |

---

## npm scripts

| Script | Purpose |
|--------|---------|
| `npm run bundle` | Runs **`bundle-github.mjs`** (pass source path as argv or **`GITHUB_MCP_SERVER_SRC`**). |
| `npm run smoke-test` | Starts the launcher briefly; requires a valid token in env for a full pass. |

---

## Troubleshooting

| Symptom | What to do |
|---------|------------|
| **`Set GITHUB_MCP_SERVER_PATH`** | No bundled binary and no env path—run **`npm run bundle`** or set **`GITHUB_MCP_SERVER_PATH`**. |
| **Child exits: token not set** | Export **`GITHUB_PERSONAL_ACCESS_TOKEN`** in MCP **`env`**. |
| **`prepublishOnly` fails** | Add **`vendor/`** binary for the current OS, or **`SKIP_BUNDLE_CHECK=1`** only for testing tarballs. |

---

## License

MIT
