# Preferred stack — Longhorn Masterplan

## Masterplan UI (`frontend/`)

- **Build:** Vite + React 18 + TypeScript
- **Styling:** Tailwind CSS (zero-runtime, dark-first)
- **Viz:** D3 v7 (force-directed completion map, orange → green gradient)
- **Markdown:** `react-markdown` + `remark-gfm` + `gray-matter`
- **Auth (Antelope):** Wharfkit (`@wharfkit/session`, `@wharfkit/web-renderer`, `@wharfkit/wallet-plugin-anchor`, `@wharfkit/wallet-plugin-webauthn`)
- **State:** React Context + URL state; no Redux
- **Test:** Vitest + Playwright (e2e for sign-in gate)

## Chain (`flavors/Annie/`)

- **Base:** AntelopeIO/spring + AntelopeIO/cdt + AntelopeIO/reference-contracts
- **Overlays:** XPRNetwork (lazy accounts, identity), Tonomy (passkeys, programmable permissions), WAX (perf, NFT-friendly), WIRE (universal transactions), VaultaFoundation (Vaulta system contracts), eosnetworkfoundation/eos-system-contracts
- **Contract language:** C++ via CDT (primary); TypeScript via XPRNetwork `ts-smart-contracts` for KV / modern patterns

## Avoid

Redux, Next.js for this repo (static viz), heavy enterprise abstractions, vendoring binary chain artifacts.
