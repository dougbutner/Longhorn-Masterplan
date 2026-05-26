---
id: lazy-accounts
title: Lazy Account Materialization
parent: longhorn
status: in_progress
progress: 15
order: 1
tags: [divergence, onboarding]
source:
  path: flavors/Annie/contracts/eosio.system/src/eosio.system.cpp
  url: https://github.com/dougbutner/Longhorn-Masterplan/blob/main/flavors/Annie/contracts/eosio.system/src/eosio.system.cpp
---

## User Story

As a new user, I create a passkey in Longhorn wallet, see my new account `EOS4vJ9JU1bJe7tPfZgpxpV3h`, fund it from a CEX with **no memo**, and start signing transactions. The chain materializes the account on my first action and bills it from the inbound balance.

## Problem Statement

Antelope requires accounts to exist (with RAM allocated) before they can receive tokens. CEXes can't send to non-existent accounts. Memo-based workarounds break under load and confuse users. This is the single biggest onboarding-tax of the entire ecosystem.

## Solution Statement

Transfers to a non-existent destination — whether a key-encoded string (`EOS4vJ9JU1bJe7tPfZgpxpV3h`) or an `@username` — auto-create the account on first action. The materialization fee is deducted from the inbound balance; RAM is billed from the incoming amount; the public key is bound to `active`.

## Reference Contracts

- [`AntelopeIO/reference-contracts`](https://github.com/AntelopeIO/reference-contracts) — `eosio.system::newaccount`, `eosio.token::transfer` notify.
- [`XPRNetwork/proton.contracts`](https://github.com/XPRNetwork/proton.contracts) — lazy-account precedent.

## Implementation Steps

1. Extend `newaccount` with a `lazy: bool` flag; lazy accounts skip RAM pre-allocation.
2. Add an `on_transfer` notify handler in `eosio.token` that detects a key-encoded `to`, derives the chain account from the key, and calls `newaccount(..., lazy=true)`.
3. Charge a fixed materialization fee from the incoming `quantity` before crediting.
4. Reserve a chain config for the maximum materialization fee and the key-derived account-name prefix.
5. Test on Jungle 4 with a CEX-style transfer from a foreign account.
