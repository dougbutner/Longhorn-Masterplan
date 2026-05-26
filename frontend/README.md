# Longhorn Masterplan — Frontend

Vite + React + TypeScript app. The single page renders the masterplan as an interactive D3 force-directed graph. Sign in with Vaulta (Wharfkit) to activate write-style actions.

## Quick start

```bash
pnpm install         # or npm install
pnpm dev             # http://localhost:5173
```

The `predev` / `prebuild` hook runs `scripts/build-plan.ts`, which reads:

- `../masterplan/*.md`            → `src/data/plan.json`
- `../CONTRIBUTORS.json`          → `src/data/contributors.json`

Re-run manually anytime with `pnpm build:plan`.

## Stack

- Vite, React 18, TypeScript
- Tailwind CSS
- D3 v7 (force layout + interpolators)
- `react-markdown` + `remark-gfm` for the side panel
- `@wharfkit/session` + Anchor wallet plugin for Vaulta / EOS sign-in
- `gray-matter` for parsing masterplan frontmatter

## Key files

- `src/App.tsx` — page composition, keyboard shortcuts.
- `src/viz/ProgressMap.tsx` — D3 force layout, orange→green node fill, expand/contract, drag, zoom.
- `src/components/MenuBar.tsx` — top bar, sign-in, Activate, filters.
- `src/components/NodePanel.tsx` — markdown side panel with Claim / Open PR.
- `src/lib/wharfkit.ts` — SessionKit singleton.
- `scripts/build-plan.ts` — masterplan → plan.json builder.

## Suggest PR (GitHub)

**Suggest PR** always tries to get your edits onto GitHub:

1. **With `GITHUB_TOKEN` on the worker** (recommended for production): creates a branch, commits your `.md`, opens a real pull request.
   ```bash
   cd frontend
   npx wrangler secret put GITHUB_TOKEN   # fine-grained or classic PAT with repo contents + PRs
   npm run deploy
   ```
   Token needs `contents: write` and `pull_requests: write` on `dougbutner/Longhorn-Masterplan`.

2. **Without token (local / fallback):** copies the full file to your clipboard, downloads a backup `.md`, and opens:
   - GitHub’s **web editor** for that file (forks automatically if needed)
   - The **new PR** form with title/body prefilled  
   Paste in the editor, commit, then submit the PR.

Local dev with API: run `npm run dev:worker` in one terminal and `npm run dev` in another (Vite proxies `/api` to the worker).

## Keyboard

| Key | Action |
|-----|--------|
| `F` | Toggle fullscreen |
| `E` | Expand all |
| `C` | Collapse all |
| `Esc` | Close side panel |
