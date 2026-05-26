---
id: retained-permissions
title: Permission System
parent: retained-core
status: done
progress: 100
order: 1
tags: [retained]
---

## User Story

As a developer, I want `owner` / `active` / custom permission levels with the weight/threshold logic I already understand.

## Problem Statement

Permissions are the trust spine of Antelope. Replacing them breaks every multisig, every cold-wallet flow, and every exchange integration.

## Solution Statement

Preserve the existing permission graph and authority weight model unchanged. Extend it additively via Programmable Permissions + Passkeys so new sig kinds can plug in without changing the base shape.

## Reference Contracts

- [`AntelopeIO/reference-contracts`](https://github.com/AntelopeIO/reference-contracts) — `eosio.system::updateauth`, native `authority` struct.

## Implementation Steps

1. Leave native authority + `updateauth` semantics untouched.
2. Reserve a new authority `kind` byte so Programmable Permissions / WebAuthn keys can be attached as additional weighted entries.
3. Keep K1/R1 signatures as the default path; passkeys are an addition, not a replacement.
