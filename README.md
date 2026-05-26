# Longhorn Masterplan

A collaborative repo for building **Annie**, a low-breakage Antelope fork, alongside a Vite frontend that visualizes the plan as an interactive D3 map and gates participation behind a Vaulta / EOS sign-in.

## Table of contents

| Area | Where |
|------|-------|
| **Masterplan** (component MDs + TOC, source of truth for the map) | [`/masterplan/README.md`](./masterplan/README.md) |
| **Frontend** (Vite + React + TS, D3 viz, Wharfkit sign-in) | [`/frontend/README.md`](./frontend/README.md) |
| **Flavors** (chain builds; Annie is the first) | [`/flavors/README.md`](./flavors/README.md) |
| **Annie flavor** (system contracts overlay) | [`/flavors/Annie/README.md`](./flavors/Annie/README.md) |
| **Contributors & colors** | [`/CONTRIBUTORS.json`](./CONTRIBUTORS.json) |
| **PR governance** (`[vaultaname]` rule) | [`/.github/PULL_REQUEST_TEMPLATE.md`](./.github/PULL_REQUEST_TEMPLATE.md) · [`/.github/workflows/pr-vaulta-name.yml`](./.github/workflows/pr-vaulta-name.yml) |
| **COGO doctrine** (ops layer for AI / repo work) | [`/COGO/COGO.md`](./COGO/COGO.md) · [`/COGO/Current-Project.md`](./COGO/Current-Project.md) |

## The shape of this repo

```
.
├── masterplan/                      one MD per component, frontmatter drives the map
│   ├── README.md                    table of contents (this is the canonical TOC)
│   ├── frontend-overview.md
│   ├── vaulta-auth.md
│   ├── d3-progress-map.md
│   ├── ux-expand-fullscreen.md
│   ├── menu-actions.md
│   ├── contributor-colors.md
│   ├── pr-governance.md
│   ├── collaboration-flow.md
│   ├── flavor-annie.md
│   ├── chain-passkey-flow.md
│   ├── lazy-account-materialization.md
│   ├── programmable-permissions.md
│   ├── enhanced-resource-model.md
│   ├── kv-storage-model.md
│   ├── events-indexing.md
│   ├── custom-system-contracts.md
│   ├── consensus-protocol-tweaks.md
│   └── reference-repos.md
├── frontend/                        Vite + React + TS app (D3 map, Vaulta sign-in)
├── flavors/
│   ├── README.md
│   ├── scripts/pull-references.sh   clones upstreams into flavors/<flavor>/upstream/
│   └── Annie/                       first flavor — see Annie/README.md
│       ├── contracts/
│       │   ├── eosio.system/
│       │   ├── eosio.token/
│       │   ├── eosio.boot/
│       │   ├── eosio.proton/
│       │   ├── eosio.passkey/
│       │   ├── eosio.kv/
│       │   ├── eosio.events/
│       │   └── eosio.subsidy/
│       ├── scripts/
│       │   ├── build.sh
│       │   └── diff-upstream.sh
│       └── upstream/                populated by flavors/scripts/pull-references.sh
├── COGO/                            ops doctrine (project memory for AI + humans)
├── CONTRIBUTORS.json                vaulta names + colors used by the UI & PR labels
└── .github/                         PR template + vaulta-name CI workflow + CODEOWNERS
```

## Getting started

### 1. Run the masterplan UI

```bash
cd frontend
pnpm install
pnpm dev
```

Visit `http://localhost:5173`, sign in with Vaulta (Anchor or passkey-capable wallet), and the **Activate** button lights up. Click any node to read its component spec; double-click to collapse a subtree; `F` for fullscreen.

### 2. Bring up Annie

```bash
flavors/scripts/pull-references.sh    # clones upstreams (one-time)
flavors/Annie/scripts/build.sh        # builds each contract via CDT
```

(Requires [AntelopeIO/cdt](https://github.com/AntelopeIO/cdt) on PATH.)

### 3. Contribute

1. Add yourself to [`CONTRIBUTORS.json`](./CONTRIBUTORS.json) (pick a hue).
2. Open a PR titled `[<your-vaulta-name>] <summary>` — CI validates the prefix and labels the PR with your color.
3. Reference the masterplan node ids you touched in the PR body so the activity feed can wire them up.

See [`masterplan/collaboration-flow.md`](./masterplan/collaboration-flow.md) for the full flow.

## The Annie North-Star UX

1. Longhorn wallet creates a passkey on device; shows the user their new account, e.g. `EOS4vJ9JU1bJe7tPfZgpxpV3h`.
2. User goes to their CEX and transfers EOS to `EOS4vJ9JU1bJe7tPfZgpxpV3h` — **no memo required**.
3. Some time later, Longhorn wallet does the first transaction on `EOS4vJ9JU1bJe7tPfZgpxpV3h` using `@active` and the passkey. The chain **materializes** the account and bills it from the inbound balance.
4. Done — the user is already signing on chain.

Full spec: [`masterplan/chain-passkey-flow.md`](./masterplan/chain-passkey-flow.md).

## License

[`LICENSE`](./LICENSE)
