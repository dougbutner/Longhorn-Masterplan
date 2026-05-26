---
id: custom-system-contracts
title: Custom System Contracts
parent: longhorn
status: in_progress
progress: 15
order: 6
tags: [divergence, contracts]
---

## User Story

As a Longhorn contract author, I have a coherent set of privileged contracts that compose cleanly with each other — identity, lazy materialization, passkey auth, events, subsidy — without each being a one-off fork.

## Solution Statement

Ship a coherent privileged-contract suite as a single overlay: `eosio.system`, `eosio.token`, `eosio.proton`-style identity, `eosio.passkey`, `eosio.events`, `eosio.subsidy`, `eosio.kv`. Each is a small additive overlay on a single declared upstream so divergences stay auditable.

## Problem Statement

Privileged actions historically scatter across forks (one ecosystem adds identity, another adds free tier, another adds events). Mixing and matching means contracts behave differently depending on the chain. Longhorn picks a coherent set, ships them together, and tracks each one against its upstream.

## Reference Contracts

- [`AntelopeIO/reference-contracts`](https://github.com/AntelopeIO/reference-contracts) — base for system + token + boot.
- [`XPRNetwork/proton.contracts`](https://github.com/XPRNetwork/proton.contracts) — identity / `@names`.
- [`Tonomy-Foundation/Tonomy-ID`](https://github.com/Tonomy-Foundation/Tonomy-ID) — passkeys / programmable permissions.

## Implementation Steps

1. Track each contract as a child node here with its own status + source mirror.
2. Each contract README declares `Upstream:` + `Upstream-path:` so divergences are diff-able against the upstream snapshot.
3. Ship `flavors/Annie/scripts/build.sh` to compile the whole suite via CDT in one pass.
