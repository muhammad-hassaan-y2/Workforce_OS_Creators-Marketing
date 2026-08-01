# @kaiso-ai/cli

Kaiso — an AI agent CLI for content creators, sales & marketing teams.

This package is the **thin client** only: auth, the terminal UI, streaming, and
local file tools (drafts). The actual agent brain (LLM calls, tool execution,
scheduling) lives in your separate Python/FastAPI backend and is *not* part of
this package.

## Requirements

- Node.js 18+
- A running backend that implements:
  - `POST /auth/device/code` and `POST /auth/device/token` (device-code login)
  - `WS /agent/stream` (streamed chat, JSON events)

  See `src/lib/auth.ts` and `src/lib/stream.ts` for the exact expected shapes —
  adjust those two files if your backend's routes differ.

## Local development

```bash
npm install
npm run dev            # runs src/index.ts directly via tsx, no build needed
npm run build           # bundles to dist/index.js (this is what gets published)
node dist/index.js      # run the built CLI locally
```

Point the CLI at a local backend during development:

```bash
node dist/index.js config set-api-url http://localhost:8000
```

## Commands

| Command | Description |
|---|---|
| `kaiso` | Opens the branded interactive session (same as `kaiso chat` with no prompt) |
| `kaiso login` | Device-code login against your backend |
| `kaiso chat "prompt"` | One-shot message, prints the result, exits |
| `kaiso draft <file>` | Opens/creates a local draft in `$EDITOR` |
| `kaiso config get` / `kaiso config set-api-url <url>` | Local configuration |

Config and the auth token are stored at `~/.kaiso/config.json` (file mode `0600`).

## Publishing to npm

1. **Create the npm scope**, if you haven't: sign in at npmjs.com → *Add
   Organization* → name it `kaiso-ai`. Free organizations can publish public
   scoped packages (`@kaiso-ai/...`).
2. **Log in from the terminal:**
   ```bash
   npm login
   ```
3. **Build and publish** from this folder:
   ```bash
   npm run build          # runs automatically via prepublishOnly too
   npm publish --access public
   ```
   `--access public` is required the first time — scoped packages default to
   private, which requires a paid npm plan.
4. **Verify:**
   ```bash
   npm view @kaiso-ai/cli
   npm install -g @kaiso-ai/cli
   kaiso --help
   ```
5. **Ship updates:** bump the version before every publish (also update
   `VERSION` in `src/index.ts` to match), then publish again:
   ```bash
   npm version patch   # or minor / major
   npm publish
   ```

### Publishing from CI (optional, recommended once this is real)

Generate a **Granular Access Token** (npmjs.com → Access Tokens → Generate New
Token → Granular, scoped to `@kaiso-ai/cli`, publish permission). Store it as
`NPM_TOKEN` in your GitHub repo secrets, then publish on tag push:

```yaml
# .github/workflows/publish.yml
name: publish
on:
  push:
    tags: ["v*"]
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: "https://registry.npmjs.org"
      - run: npm ci
      - run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Notes / next steps

- The banner uses a gradient + figlet wordmark in the logo's purple→blue,
  since terminals can't render a PNG by default. If you want the literal mark
  to show in terminals that support inline images (iTerm2, Kitty), the
  `terminal-image` package can render it as a best-effort enhancement with a
  fallback to this banner elsewhere.
- Token storage currently uses a plain file (`~/.kaiso/config.json`, mode
  `0600`). For a production release, swapping in `keytar` to use the OS
  keychain is a worthwhile upgrade — left out here since it requires native
  bindings that complicate a first build.
