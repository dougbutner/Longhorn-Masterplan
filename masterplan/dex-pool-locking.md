---
id: dex-pool-locking
title: Protocol-Level Pool Locking
parent: dex-mechanics
status: not_started
progress: 0
order: 0
tags: [dex]
---

## User Story

As a market maker holding a reflection-taxed token in a pool, swaps through my pool don't bleed reflection fees and don't pollute the holder reflection table.

## Problem Statement

Reflection-tax tokens inside an AMM redistribute their reflection to themselves with every swap, making spreads quote incorrectly and creating MEV opportunities for bots.

## Solution Statement

A privileged `lock_pool(pool, liquidity, lock_period)` action registers a pool address as "reflection-exempt" for the duration of the lock. The reflection token contract reads this list and skips locked addresses on the split.

## Reference Contracts

- New.

## Implementation Steps

1. `eosio.dex::lock_pool(pool, liquidity, lock_period)` writes a row in `locked_pools` KV.
2. Reflection contract checks `locked_pools` on every transfer.
3. Lock period extends automatically while liquidity stays above a threshold.
4. Audit trail: every lock + unlock emits an event (`Events & Indexing`).
