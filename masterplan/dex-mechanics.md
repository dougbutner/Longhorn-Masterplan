---
id: dex-mechanics
title: Advanced LP & DEX Mechanics
parent: longhorn
status: not_started
progress: 5
order: 9
tags: [divergence, dex, economics]
---

## User Story

As a market maker, I deploy a pool that's cheap to interact with, protected from reflection tax, and supports native perpetuals — without having to bolt these features on top of a stock AMM.

## Problem Statement

Reflection-tax tokens break naive LPs (every swap eats fees). Perpetuals live in app-layer contracts with bespoke economics. Fees are inconsistent between dapps.

## Solution Statement

Three protocol-level primitives ship together: pool locking (a contract registers a pool address as "locked" so reflection logic skips it), native perpetual support (`execute_perp`), and a standardized DEX fee model so every dapp has the same economic baseline.

## Reference Contracts

- New, but informed by GMX-style perps + Uniswap v3 LP design.

## Implementation Steps

1. Ship the three sub-features in `pool-locking`, `perpetuals`, and `fee-bypass` child nodes.
2. Document the canonical fee schedule + reflection-exemption rules.
3. Provide a reference DEX contract under `flavors/Annie/contracts/eosio.dex/`.
