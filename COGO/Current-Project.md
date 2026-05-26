# Current Project — Longhorn Masterplan

## Objective

Build **Longhorn**, a low-breakage Antelope release that retains 12-char accounts, the permission system, the subjective resource model, and the WASM/CDT baseline — while adding lazy account materialization, native passkey/WebAuthn permissions, an enhanced resource model, KV storage, richer events, reflection-backed tokens, fractal-style governance, native DEX/perp mechanics, and consensus tweaks. The repo also hosts a Vite frontend that gates participation behind a Vaulta/EOS sign-in and visualizes plan progress as an interactive D3 map whose feature nodes always mirror the live contract code.

## Current Focus

1. `masterplan/` — feature tree rooted at `longhorn`. Each MD has the 7-section template (User Story / Problem / Solution / Reference Contracts / Implementation Steps; build script appends the live code snippet + update link).
2. `frontend/` — Vite + React + TS UI. Single page; D3 force layout with Longhorn pinned at center; nodes colored orange→green by `progress`; click → markdown side panel including mirrored source code.
3. `flavors/Annie/` — implementation slot for the chain work (hidden from front-of-house). Source files here are what the masterplan MDs mirror via `source.path`.
4. Governance — every PR title must include `[vaultaname]`; contributors live in `CONTRIBUTORS.json` with a color assignment used by the UI.

## Recent Decisions

- **Hide flavor concept from the website.** The UI shows Longhorn + features only. `flavors/Annie/` continues to exist as the implementation slot but is invisible to viewers.
- **Hierarchy via `parent` (not `depends_on`).** Three-level cap (root → feature → sub-feature). Each MD has `parent`, `order`, optional `source.path`.
- **Code mirroring.** When a feature MD declares `source.path`, `frontend/scripts/build-plan.ts` reads that file and appends a "Full code snippet" + "Update with changes" section. The website always reflects the live code.
- **Auth:** Wharfkit SessionKit (EOS chain) with Anchor today; passkey/WebAuthn wallet plugin to follow once the Longhorn wallet ships it.

## Blockers

- Need Longhorn wallet integration once the passkey plugin is ready (currently Anchor only).
- Privileged contract scaffolds in `flavors/Annie/contracts/*/src/*.cpp` are stubs; the mirrored code currently shows the stub. As real code lands, the website auto-updates.

## Next Steps

- Fill in `flavors/Annie/contracts/eosio.system/src/eosio.system.cpp` with the lazy-create + on_transfer implementation.
- Fill in `flavors/Annie/contracts/eosio.passkey/src/eosio.passkey.cpp` with WebAuthn verification.
- Stand up Jungle-4 leaf for integration testing per [`masterplan/jungle4-testing.md`](../masterplan/jungle4-testing.md).
- As features ship, bump each MD's `progress`; the map turns greener on the next build.
