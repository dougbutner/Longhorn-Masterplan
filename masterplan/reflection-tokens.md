---
id: reflection-tokens
title: Reflection-Backed Token System
parent: longhorn
status: not_started
progress: 5
order: 7
tags: [divergence, tokens, economics]
source:
  path: flavors/Annie/contracts/eosio.token/README.md
  url: https://github.com/dougbutner/Longhorn-Masterplan/blob/main/flavors/Annie/contracts/eosio.token/README.md
---

## User Story

As a token holder, every time someone transfers the token I hold, I receive a tiny reflection directly in my wallet. A portion of the same fee funds the community coffers that the Fractal Governance overlay distributes.

## Problem Statement

Most token designs concentrate value at the issuer + treasury. Holders take risk but receive no direct flow. Reflection mechanisms exist on other chains but they break LPs and are vulnerable to bot extraction.

## Solution Statement

A wrapped-token contract that, on every transfer, taxes a configurable fee and splits it: most of it as reflection to current holders (proportional to balance), the rest into a community treasury wallet (consumed by Fractal Governance). DEX pools opt out of reflection via the protocol-level pool-locking primitive (see DEX Mechanics).

## Reference Contracts

- [`AntelopeIO/reference-contracts`](https://github.com/AntelopeIO/reference-contracts) — `eosio.token::transfer`.

## Implementation Steps

1. Wrapper contract `wraptoken.x` that holds and reissues an underlying token with reflection hooks.
2. Extend `transfer(from, to, quantity, memo)` with a reflection accumulator updated each block.
3. `apply_reflection(token_contract, amount)` cron-style action settles holder balances.
4. Exclude addresses listed in `eosio.dex::locked_pools` from the reflection split.
5. Community-treasury portion routes to `eosio.fractal::community_fund`.
