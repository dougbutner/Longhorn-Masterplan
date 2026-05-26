---
id: menu-actions
title: Menu actions
status: not_started
progress: 0
owners: []
depends_on: [vaulta-auth, d3-progress-map]
tags: [frontend, ux]
---

# Menu actions

The top-right menu is the primary "direct interaction" surface for signed-in users. All actions are deep-linked so they can be hit from anywhere.

## Always-available

- **Fullscreen** (`F`)
- **Expand all** (`E`)
- **Collapse all** (`C`)
- **Filter by tag** (modal multi-select; chips along the top)
- **Filter by contributor** (legend chips toggle)

## Requires sign-in (Activate)

- **Claim node** — sets `owners += [<actor>]` and opens PR `[<actor>] claim <node-id>`.
- **Update progress** — slider in side panel, commits to a PR `[<actor>] progress <node-id>: NN%`.
- **Open issue** — pre-fills repo issue with node context.
- **Open PR template** — copies a freshly composed PR body to clipboard.
- **Sign-out** — clears Wharfkit session and `localStorage`.

## Implementation

`frontend/src/components/MenuBar.tsx`. Items disabled with a tooltip ("Sign in with Vaulta to claim nodes") rather than hidden, so the surface is discoverable.
