---
id: retained-account-names
title: 12-Character Account Names
parent: retained-core
status: done
progress: 100
order: 0
tags: [retained]
---

## User Story

As a user, I want my account name to stay short, memorable, and compatible with every Antelope wallet and explorer.

## Problem Statement

Some forks have proposed renaming or restructuring accounts. Doing so invalidates every wallet, contract, and indexer that already knows how to parse a `name`.

## Solution Statement

Keep the 12-character base32-style `name` type exactly as defined by Antelope. Layer human-readable `@names` (resolved via identity contract) and hashed/long account references on top — never replacing the base.

## Reference Contracts

- [`AntelopeIO/reference-contracts`](https://github.com/AntelopeIO/reference-contracts) — `name` type, `eosio.system::newaccount`.

## Implementation Steps

1. Take no action on the base `name` type.
2. Reserve a name prefix range for hashed/long-account proxies (see Lazy Account Materialization).
3. Surface `@name` lookup via the identity overlay (see Custom System Contracts).
