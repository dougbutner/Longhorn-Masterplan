---
id: lazy-passkey-actions
title: Privileged Lazy / Passkey Actions
parent: custom-system-contracts
status: not_started
progress: 5
order: 1
tags: [contracts, passkey]
source:
  path: flavors/Annie/contracts/eosio.system/src/eosio.system.cpp
  url: https://github.com/dougbutner/Longhorn-Masterplan/blob/main/flavors/Annie/contracts/eosio.system/src/eosio.system.cpp
---

## User Story

As `eosio.system`, I can materialize accounts on transfer and accept passkey-signed authorizations on `@active` — without any of that logic leaking into unprivileged contracts.

## Problem Statement

Lazy materialization and passkey auth need privileged operations (account creation, sig kind registration, billing). They have to live inside the system contract suite to be safe.

## Solution Statement

A small set of privileged actions glued onto `eosio.system`, callable only by the chain itself:

- `create_account(creator, newacc, key, lazy)`
- `on_transfer(from, to, quantity, memo)` (notify-handler glue for lazy)
- `bind_passkey(account, credential)`
- `register_sig_kind(kind, abi_fragment)` (for future sig types)

## Reference Contracts

- [`AntelopeIO/reference-contracts`](https://github.com/AntelopeIO/reference-contracts) — `eosio.system`.

## Implementation Steps

1. Land the four actions as a small auditable diff against reference-contracts.
2. Restrict to privileged-only with a clean failure when called by a non-privileged actor.
3. Pair every action with a unit test in `tests/`.
