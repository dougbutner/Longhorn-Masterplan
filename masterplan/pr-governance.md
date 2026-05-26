---
id: pr-governance
title: PR governance & [vaultaname]
status: in_progress
progress: 60
owners: [dougbutner]
depends_on: []
tags: [governance]
---

# PR governance & [vaultaname]

Every pull request to this repo must:

1. **Start with `[<vaultaname>]`** in the title, where `<vaultaname>` is a known key in `CONTRIBUTORS.json`.
   - Examples: `[annie] add lazy account materialization`, `[dougbutner] wire d3 force layout`.
2. Pass the `.github/workflows/pr-vaulta-name.yml` CI check, which:
   - Parses the title, validates the prefix against `CONTRIBUTORS.json`.
   - Adds a colored label (e.g. `vaulta:annie`) for the dashboard.
3. Reference at least one masterplan node id in the body (e.g. `Updates: d3-progress-map, menu-actions`) so the activity feed can link the PR to nodes.

## Why a name token, not the GitHub login?

The Vaulta name is the on-chain identity — the same identifier that signs masterplan UI actions. Tying PR provenance to it lets us:

- Render contributors consistently in the map (same color as the in-app pill).
- Eventually accept signed PR bodies (Wharfkit-signed proofs) for permissionless contribution.

## Files

- `.github/PULL_REQUEST_TEMPLATE.md` — the template hands users `[<your-vaulta-name>]` skeleton.
- `.github/workflows/pr-vaulta-name.yml` — enforces the rule.
- `.github/CODEOWNERS` — routes review to the right humans.
