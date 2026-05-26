# Current Project — Longhorn Masterplan

## Objective

Build a collaborative masterplan around the **Annie** flavor: a low-breakage Antelope fork featuring lazy account materialization, native passkey/WebAuthn permissions, an enhanced resource model, KV storage, and richer eventing. The repo also hosts a Vite frontend that gates participation behind a Vaulta/EOS sign-in and visualizes plan progress as an interactive D3 map.

## Current Focus

1. `masterplan/` — component design docs with completion-state frontmatter (acts as the source of truth for the D3 map).
2. `frontend/` — Vite + React + TS UI: Vaulta sign-in (Wharfkit), clickable progress map (orange → green), node expand/contract, fullscreen mode, MD viewer.
3. `flavors/Annie/` — first complete fork build: vendored system-contract overlays from AntelopeIO, XPRNetwork, Tonomy, WAX, WIRE, Vaulta references.
4. Governance — every PR title must include `[vaultaname]`; contributors live in `CONTRIBUTORS.json` with a color assignment used by the UI.

## Recent Decisions

- **Stack tweak for this repo:** Vite + React + TS + Tailwind for the masterplan UI (lightweight, no Next runtime needed for a static plan visualizer).
- **Auth:** Wharfkit SessionKit with the WebAuthn (passkey) wallet plugin; EOS / Vaulta chain selectable; signature challenge gates the "Activate" button.
- **Plan format:** YAML frontmatter (`id`, `title`, `status`, `progress`, `owners`, `depends_on`, `tags`) on every `masterplan/*.md`. A `plan.json` is generated for the frontend.
- **Flavors layout:** `flavors/<name>/contracts/<contract>/` — `Annie` is the first flavor; upstream sources fetched via `flavors/scripts/pull-references.sh`.
- **PR Discipline:** `[vaultaname]` token at start of PR title, `CODEOWNERS` checks, label mapped to contributor color.

## Blockers

- Need real Vaulta account names per contributor before colors can be finalized (start with `annie`, `dougbutner`).
- Vendoring upstream contracts requires running `flavors/scripts/pull-references.sh` (network outside this sandbox).

## Next Steps

- Land masterplan MDs and TOC README.
- Land frontend skeleton; verify D3 map renders and Vaulta sign-in flow loads.
- Run `pull-references.sh` to populate `flavors/Annie/upstream/*`.
- Open the first round of PRs under the `[annie]` namespace.
