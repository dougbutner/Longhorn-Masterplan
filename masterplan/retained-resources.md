---
id: retained-resources
title: Subjective Resource Model
parent: retained-core
status: done
progress: 100
order: 2
tags: [retained]
---

## User Story

As a contract author, I want CPU/NET/RAM to behave the way I designed against — measurable, predictable, and effectively free for well-behaved contracts.

## Problem Statement

Replacing CPU/NET/RAM with a gas model breaks the whole point of Antelope's subjective billing.

## Solution Statement

Keep CPU/NET/RAM intrinsics, staking, and billing semantics. The Enhanced Resource Model overlay adds a free-tier subsidy on top — contracts can't tell the difference.

## Reference Contracts

- [`AntelopeIO/reference-contracts`](https://github.com/AntelopeIO/reference-contracts) — `eosio.system::delegatebw`, `buyrambytes`.

## Implementation Steps

1. Do not change intrinsics or accounting structures.
2. Route the free-tier subsidy through a privileged `eosio.subsidy` contract that pays into the existing CPU/NET buckets.
3. Existing wallets and contracts see "the user has some stake" — same shape, different source.
