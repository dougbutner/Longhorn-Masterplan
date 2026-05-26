# Longhorn Masterplan

The masterplan is a graph of design components. Every file in this folder is a node; every node carries YAML frontmatter the UI uses to render the D3 completion map:

```yaml
---
id: vaulta-auth                 # unique slug, matches filename
title: Vaulta / EOS Sign-In
status: in_progress             # not_started | in_progress | review | done
progress: 40                    # 0-100, drives orange→green
owners: [annie, dougbutner]     # vaulta names, looked up in CONTRIBUTORS.json
depends_on: [frontend-overview] # graph edges
tags: [frontend, auth]
---
```

When you change a node, update its `progress` and `status`, then open a PR with `[yourvaultaname]` in the title.

## Component table of contents

### Frontend / UX

| # | Status | Component | File |
|---|--------|-----------|------|
| 1 | in_progress | Frontend overview | [`frontend-overview.md`](./frontend-overview.md) |
| 2 | in_progress | Vaulta / EOS sign-in | [`vaulta-auth.md`](./vaulta-auth.md) |
| 3 | in_progress | D3 progress map | [`d3-progress-map.md`](./d3-progress-map.md) |
| 4 | not_started | Node expand / contract & fullscreen | [`ux-expand-fullscreen.md`](./ux-expand-fullscreen.md) |
| 5 | not_started | Menu actions | [`menu-actions.md`](./menu-actions.md) |
| 6 | not_started | Contributor colors | [`contributor-colors.md`](./contributor-colors.md) |

### Collaboration / governance

| # | Status | Component | File |
|---|--------|-----------|------|
| 7 | in_progress | PR governance & `[vaultaname]` | [`pr-governance.md`](./pr-governance.md) |
| 8 | not_started | Collaboration flow | [`collaboration-flow.md`](./collaboration-flow.md) |

### Chain — Annie flavor

| # | Status | Component | File |
|---|--------|-----------|------|
| 9  | in_progress | Annie flavor overview | [`flavor-annie.md`](./flavor-annie.md) |
| 10 | not_started | Chain & passkey UX flow | [`chain-passkey-flow.md`](./chain-passkey-flow.md) |
| 11 | not_started | Lazy account materialization | [`lazy-account-materialization.md`](./lazy-account-materialization.md) |
| 12 | not_started | Programmable permissions + passkeys | [`programmable-permissions.md`](./programmable-permissions.md) |
| 13 | not_started | Enhanced resource model | [`enhanced-resource-model.md`](./enhanced-resource-model.md) |
| 14 | not_started | KV storage model | [`kv-storage-model.md`](./kv-storage-model.md) |
| 15 | not_started | Events & indexing | [`events-indexing.md`](./events-indexing.md) |
| 16 | not_started | Custom system contracts | [`custom-system-contracts.md`](./custom-system-contracts.md) |
| 17 | not_started | Consensus & protocol tweaks | [`consensus-protocol-tweaks.md`](./consensus-protocol-tweaks.md) |
| 18 | in_progress | Reference repositories | [`reference-repos.md`](./reference-repos.md) |

## How the map reads this folder

1. `frontend/scripts/build-plan.ts` walks `masterplan/*.md`, parses frontmatter, and emits `frontend/src/data/plan.json`.
2. The D3 force layout draws one node per file, sized by `progress`, edged by `depends_on`, and colored on a continuous orange→green scale.
3. Clicking a node opens the rendered markdown in a side panel.
4. A signed-in user (Vaulta) can claim ownership of a node from the side panel; this opens a pre-filled PR titled `[<actor>] claim <node-id>`.

## Conventions

- One concept per file; keep MDs short.
- Always update `progress` and `status` when you ship a change.
- New nodes? Add the file, add a row above, link any `depends_on` ids.
