---
id: programmable-permissions
title: Programmable Permissions + Passkeys
parent: longhorn
status: in_progress
progress: 10
order: 2
tags: [divergence, auth, passkey]
source:
  path: flavors/Annie/contracts/eosio.passkey/src/eosio.passkey.cpp
  url: https://github.com/dougbutner/Longhorn-Masterplan/blob/main/flavors/Annie/contracts/eosio.passkey/src/eosio.passkey.cpp
---

## User Story

As a user, I sign transactions on Longhorn with the same passkey I use to log into web apps — no seed phrase, no browser extension, no separate signer install.

## Problem Statement

Antelope authorities only natively support `K1` / `R1` keys. WebAuthn (the actual standard browsers and mobile OSes implement for passwordless auth) isn't a first-class citizen. Bolt-on signers exist but they're fragile and ecosystem-specific.

## Solution Statement

Two complementary additions: (1) a sandboxed WASM "permission program" that any account can install to evaluate `(action, context) → bool`, and (2) native WebAuthn signature verification (`auth_passkey`) so a passkey can be a weighted entry in any authority — including `active` — alongside K1/R1 keys.

## Reference Contracts

- [`Tonomy-Foundation/Tonomy-ID`](https://github.com/Tonomy-Foundation/Tonomy-ID) — passkey + DID precedent.
- [`AntelopeIO/reference-contracts`](https://github.com/AntelopeIO/reference-contracts) — authority + permission_level structures.

## Implementation Steps

1. Reserve a new `kind` byte for WebAuthn signatures in the wire format.
2. Add `eosio.passkey::auth_passkey(account, sig, data)` action that verifies a WebAuthn assertion.
3. Add `eosio.passkey::set_permission_logic(account, permission, wasm_logic)` action that stores a sandboxed WASM module evaluated during authorization.
4. Allow the existing `authority` struct to reference a passkey credential descriptor (stored in `eosio.kv`).
5. Ship a wallet integration so creating a Longhorn account creates a passkey by default.
