---
id: longhorn
title: Longhorn
parent: null
status: in_progress
progress: 20
order: 0
tags: [release]
---

## User Story

As a builder and as a user, I want a chain that keeps everything I already love about Antelope (12-character accounts, predictable permissions, subjective resources, mature WASM contracts) and removes the few rough edges that block normal-person onboarding and modern token economics.

## Problem Statement

Antelope is the most production-tested smart-contract base most people have never heard of. The friction points that keep it niche are: accounts must exist before they can receive tokens, no native passkey/WebAuthn, no first-class KV, no native reflection/governance economics, and DEX/perp mechanics aren't standardized at the protocol level.

## Solution Statement

Longhorn is a low-breakage release that ships every divergence as an additive overlay: lazy accounts, passkeys, an enhanced resource model, KV storage, richer events, reflection-backed tokens, fractal-style governance, native DEX/perp mechanics, and consensus tweaks — while preserving binary compatibility with existing CDT-compiled contracts.

## Reference Contracts

- [`AntelopeIO/reference-contracts`](https://github.com/AntelopeIO/reference-contracts) — base for `eosio.system`, `eosio.token`, `eosio.boot`.
- [`AntelopeIO/spring`](https://github.com/AntelopeIO/spring) — node software with Savanna finality.
- [`AntelopeIO/cdt`](https://github.com/AntelopeIO/cdt) — contract dev toolkit.

## Implementation Steps

1. Ship retained-core surface (account names, permissions, subjective resources, WASM/CDT baseline) unchanged.
2. Layer divergences in order: lazy accounts → programmable permissions → resource subsidy → KV → events → custom system contracts → reflection tokens → fractal governance → DEX/perps → consensus tweaks.
3. Stand up Jungle 4 as the integration testbed; validate every divergence there before promoting to mainnet.
4. Mirror real contract source into every feature node on this site so progress always reflects the code.
