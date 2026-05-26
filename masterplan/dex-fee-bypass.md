---
id: dex-fee-bypass
title: Standardized DEX Fee Schedule
parent: dex-mechanics
status: not_started
progress: 0
order: 2
tags: [dex]
---

## User Story

As a builder, I quote and integrate fees the same way against every DEX on Longhorn.

## Problem Statement

Inconsistent fee models across DEXes makes routing, accounting, and UX inconsistent. Reflection-aware integrations have to special-case every DEX.

## Solution Statement

Chain-defined canonical fee schedule (`apply_dex_fee(pool, fee, bypass_tax)`) that any DEX contract can call to record fees. Bots and aggregators see a uniform fee surface; reflection logic reads the same surface to skip taxed pools.

## Reference Contracts

- New.

## Implementation Steps

1. `eosio.dex::apply_dex_fee(pool, fee, bypass_tax)`.
2. Canonical fee tiers; per-pool override governed by Fractal proposal.
3. Public read-only view so aggregators can ingest the fee surface.
