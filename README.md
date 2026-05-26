# Longhorn Masterplan

A collaborative repo for building **Longhorn** — a low-breakage Antelope release — with a Vite frontend that visualizes every release feature as an interactive D3 map and gates participation behind a Vaulta / EOS sign-in.

## Table of contents

| Area | Where |
|------|-------|
| **Masterplan** (release-feature tree, source of truth for the map) | [`/masterplan/README.md`](./masterplan/README.md) |
| **Frontend** (Vite + React + TS, D3 viz, Wharfkit sign-in) | [`/frontend/README.md`](./frontend/README.md) |
| **Contributors & colors** | [`/CONTRIBUTORS.json`](./CONTRIBUTORS.json) |
| **PR governance** (`[vaultaname]` rule) | [`/.github/PULL_REQUEST_TEMPLATE.md`](./.github/PULL_REQUEST_TEMPLATE.md) · [`/.github/workflows/pr-vaulta-name.yml`](./.github/workflows/pr-vaulta-name.yml) |
| **COGO doctrine** (ops layer for AI / repo work) | [`/COGO/COGO.md`](./COGO/COGO.md) · [`/COGO/Current-Project.md`](./COGO/Current-Project.md) |

## How the site works

1. Every feature is a markdown file in [`/masterplan`](./masterplan) with YAML frontmatter (`id`, `title`, `parent`, `status`, `progress`, `tags`, optional `source.path`).
2. The frontend at [`/frontend`](./frontend) parses the masterplan into a tree rooted at **Longhorn**, draws it as a D3 force-directed map, colors each node orange→green by `progress`, and stripes the stroke with the last contributor's color.
3. When a node sets `source.path`, the build script reads that file (a real contract source) and appends a **Full code snippet** + **Update with changes** section, so the website always mirrors the live contract code.
4. Signing in with Vaulta unlocks the **Activate** button and lets you Claim nodes / open PRs straight from the UI.

The full feature tree, the body template every node uses, and the editing rules live in [`/masterplan/README.md`](./masterplan/README.md).

## The Longhorn North-Star UX

1. Longhorn wallet creates a passkey on device; shows the user their new account, e.g. `EOS4vJ9JU1bJe7tPfZgpxpV3h`.
2. User goes to their CEX and transfers EOS to `EOS4vJ9JU1bJe7tPfZgpxpV3h` — **no memo required**.
3. Some time later, Longhorn wallet does the first transaction on `EOS4vJ9JU1bJe7tPfZgpxpV3h` using `@active` and the passkey. The chain **materializes** the account and bills it from the inbound balance.
4. Done — the user is already signing on chain.

Backing spec: [`masterplan/lazy-accounts.md`](./masterplan/lazy-accounts.md) + [`masterplan/programmable-permissions.md`](./masterplan/programmable-permissions.md).

## Run the masterplan UI

```bash
cd frontend
npm install
npm run dev   # http://localhost:5173
```

`npm run dev` regenerates `frontend/src/data/plan.json` from `masterplan/*.md` first, so every change to a feature MD shows up immediately. Production deploy: `npm run build` outputs `frontend/dist`.

## Contribute

1. Add yourself to [`CONTRIBUTORS.json`](./CONTRIBUTORS.json) (pick a hue).
2. Open a PR titled `[<your-vaulta-name>] <summary>` — CI validates the prefix and labels the PR with your color.
3. Reference the masterplan node ids you touched in the PR body so the activity feed can wire them up.

## License

[`LICENSE`](./LICENSE)
