---
id: consensus-tweaks
title: Consensus & Protocol Tweaks
parent: longhorn
status: not_started
progress: 0
order: 10
tags: [divergence, consensus]
---

## User Story

As a user, my transactions feel fast and final; as a builder, cross-chain claims verify cheaply.

## Problem Statement

Antelope's default finality is sub-second on Savanna but the UX surface (wallets, dapps) doesn't always wire it through. IBC modules require a lot of glue to deploy.

## Solution Statement

Track AntelopeIO/spring's Savanna releases. Ship a default IBC light-client config so masterplan dapps can verify cross-chain claims out of the box. Tune dPoS curves for higher participation; jitter BP schedule for more uniform block times under load.

## Reference Contracts

- [`AntelopeIO/spring`](https://github.com/AntelopeIO/spring) — node software.

## Implementation Steps

1. Pin Spring release tag; document upgrade cadence.
2. Bundle IBC light clients for EOS, Vaulta, Jungle 4 by default.
3. Vote-decay curve + BP-jitter as chain-config knobs (no hard fork to tune).
