---
id: frontend-overview
title: Frontend overview
status: in_progress
progress: 35
owners: [dougbutner]
depends_on: []
tags: [frontend]
---

# Frontend overview

The frontend in `/frontend` is the masterplan's interactive dashboard. It is intentionally minimal:

- **Vite** dev server, **React 18 + TypeScript**, **Tailwind** for styling.
- A single page renders a **D3 force-directed graph** of the masterplan nodes.
- A side panel shows the markdown body of whichever node is clicked.
- Top-bar shows: chain selector (EOS / Vaulta), sign-in button, fullscreen toggle, expand/collapse-all, contributor legend.

## Responsibilities

1. Load `src/data/plan.json` (generated from `masterplan/*.md` frontmatter).
2. Load `src/data/contributors.json` (generated from `CONTRIBUTORS.json`).
3. Mount Wharfkit `SessionKit` and expose a sign-in CTA.
4. Provide a menu of direct user actions once signed in.

## Non-goals

- No backend; everything is static-hostable (Cloudflare Pages, GitHub Pages).
- No realtime sync beyond reloading `plan.json` when the repo updates.
