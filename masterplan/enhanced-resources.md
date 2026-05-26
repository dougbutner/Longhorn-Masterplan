---
id: enhanced-resources
title: Enhanced Resource Model
parent: longhorn
status: in_progress
progress: 10
order: 3
tags: [divergence, resources, onboarding]
source:
  path: flavors/Annie/contracts/eosio.subsidy/README.md
  url: https://github.com/dougbutner/Longhorn-Masterplan/blob/main/flavors/Annie/contracts/eosio.subsidy/README.md
---

## User Story

As a brand-new account, my first few transactions feel free — the chain underwrites me until I have skin in the game.

## Problem Statement

Subjective billing requires CPU/NET stake or PowerUp to transact. A freshly materialized account has neither, so the first action after onboarding hits a wall. That wall is the second-biggest onboarding tax after lazy accounts.

## Solution Statement

A privileged `eosio.subsidy` contract refills a per-account token bucket every block. Newly materialized accounts get an initial allotment large enough for their first ~10 actions; the bucket caps at a small per-block refill. Block producers tune the curves via a voted parameter — no hard fork needed.

## Reference Contracts

- [`AntelopeIO/reference-contracts`](https://github.com/AntelopeIO/reference-contracts) — `eosio.system::delegatebw`, `buyrambytes`.

## Implementation Steps

1. Stand up `eosio.subsidy` as a privileged contract.
2. Implement `grant_free_tier(receiver, cpu_ms, net_bytes)` callable from `eosio.system::newaccount`.
3. Token-bucket per account, refilled every block based on `set_curve(curve_id, params)`.
4. Wire bucket lookup into CPU/NET accounting so contracts see "the user has some stake".
5. BP vote action to update curves; no hard fork.
