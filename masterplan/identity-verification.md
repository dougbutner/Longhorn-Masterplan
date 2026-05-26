---
id: identity-verification
title: Identity Verification
parent: custom-system-contracts
status: not_started
progress: 5
order: 0
tags: [contracts, identity]
source:
  path: flavors/Annie/contracts/eosio.proton/README.md
  url: https://github.com/dougbutner/Longhorn-Masterplan/blob/main/flavors/Annie/contracts/eosio.proton/README.md
---

## User Story

As a user, I can prove I'm a real person to apps that care (KYC, anti-bot) without exposing my legal identity to the chain.

## Problem Statement

Bots and sybils break many on-chain economic designs. Today identity is duct-tape: an off-chain KYC vendor stores a flag and apps trust the vendor.

## Solution Statement

`eosio.proton`-style identity contract stores `verified: bool` per account, plus an issuer signature so apps can audit the provenance of the verification. The proof itself stays off chain; only the attestation does.

## Reference Contracts

- [`XPRNetwork/proton.contracts`](https://github.com/XPRNetwork/proton.contracts) — `eosio.proton`.

## Implementation Steps

1. `verify_identity(account, proof)` — privileged; called by a whitelisted issuer.
2. `set_verified(account, status)` — privileged; flips the bit.
3. Public read-only view so any contract can branch on `is_verified(account)`.
4. Issue rotation + revocation flow.
