---
id: consensus-protocol-tweaks
title: Consensus & protocol tweaks
status: not_started
progress: 0
owners: [annie]
depends_on: [flavor-annie]
tags: [chain, consensus]
---

# Consensus & protocol tweaks

Surface-level changes only — contract authors should see no behavior change.

## Faster finality

- Track `AntelopeIO/spring`'s **Savanna** finality work and pin to a known-good release.
- Optional pre-confirmation gossip among BPs for sub-second user-visible latency.

## IBC

- Adopt the latest reference IBC modules; ship a default light-client config so masterplan UIs can verify cross-chain claims.

## dPoS tuning

- Vote-decay curve tuned for higher participation.
- BP schedule jitter to make block-time more uniform under load.

## What's intentionally *not* changed

- Action format, transaction format, signature recovery (beyond adding passkey kind byte).
- WASM intrinsics surface — CDT-compiled contracts from upstream remain ABI-compatible.
