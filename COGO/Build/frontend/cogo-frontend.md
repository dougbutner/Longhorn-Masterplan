# Frontend — Masterplan UI

The frontend in `/frontend` is a Vite + React + TypeScript single page app whose sole job is to:

1. Gate participation behind a **Vaulta / EOS sign-in** (Wharfkit SessionKit, passkey-friendly).
2. Render the contents of `/masterplan/*.md` as an interactive **D3 force-directed map**, colored from orange (0%) to green (100%).
3. Allow nodes to be **expanded / contracted**, opened **fullscreen**, and **clicked** to reveal the underlying markdown content in a side panel.
4. Show **who pushed what** by tinting each node's stroke with the contributor color from `CONTRIBUTORS.json`.
5. Expose a **menu** for direct user actions (Activate, Claim node, Open PR template, Fullscreen, Expand-all / Collapse-all).

## Data flow

```
masterplan/*.md  →  scripts/build-plan.ts  →  frontend/src/data/plan.json
                                            ↘  frontend/src/data/contributors.json (from CONTRIBUTORS.json)
```

The Vite dev server reads the generated `plan.json` so we don't ship a markdown parser in production beyond `gray-matter`. PRs trigger CI to regenerate `plan.json`.

## Sign-in gate

- `SessionKit({ chains: [EOS, Vaulta], ui: WebRenderer, walletPlugins: [Anchor, WebAuthn] })`.
- Signed identity proof unlocks the **"Activate"** button which enables write-style menu items (claim node, open PR).
- The Vaulta name attaches to every PR template the UI generates.

## Conventions

- Components in `frontend/src/components/`, hooks in `frontend/src/hooks/`, viz in `frontend/src/viz/`.
- All colors live in `frontend/src/theme.ts` (orange `#f97316` → green `#22c55e` interpolated via `d3-interpolate`).
- Keep the bundle lean: no Redux, no UI kit beyond Tailwind primitives.
