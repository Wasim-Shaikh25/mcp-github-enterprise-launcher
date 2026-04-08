# Bundled `github-mcp-server` binary

Maintainers copy the built binary here **before** `npm publish` so end users can rely on **`npx`** alone.

```bash
node scripts/bundle-github.mjs /path/to/github-mcp-server.exe
```

**Filenames:** `github-mcp-server.exe` (Windows), `github-mcp-server-linux`, `github-mcp-server-macos`.

This directory is **gitignored** except this file; the published npm tarball still includes binaries if present on disk when you pack.

**Full documentation:** [../README.md](../README.md)
