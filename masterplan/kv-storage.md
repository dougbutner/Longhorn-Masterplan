---
id: kv-storage
title: KV Storage Model
parent: longhorn
status: in_progress
progress: 10
order: 4
tags: [divergence, storage]
source:
  path: flavors/Annie/contracts/eosio.kv/README.md
  url: https://github.com/dougbutner/Longhorn-Masterplan/blob/main/flavors/Annie/contracts/eosio.kv/README.md
---

## User Story

As a contract developer, I store arbitrary blobs by key without designing a multi-index schema and without paying for unused secondary indexes.

## Problem Statement

Antelope's multi-index is powerful but verbose. Even when a contract only needs primary-key lookup, the multi-index machinery imposes a layout and a RAM overhead. Modern contract languages (and modern developers) expect KV as a first-class primitive.

## Solution Statement

A first-class KV table primitive available in both C++ (via CDT intrinsics) and TypeScript (via the XPRNetwork-style `@table` decorator). Secondary indexes are opt-in and per-entry. Same RAM-billing model as multi-index, lower per-entry overhead.

## Reference Contracts

- [`XPRNetwork/ts-smart-contracts`](https://github.com/XPRNetwork/ts-smart-contracts) — TS KV decorator precedent.

## Implementation Steps

1. Add KV intrinsics to CDT (`kv_set`, `kv_get`, `kv_erase`, iterator helpers).
2. Add `@table("kvstore")` decorator to the TS contracts SDK with `@primaryKey` and opt-in `@secondary`.
3. RAM billing identical to multi-index but per-entry; secondaries billed only when present.
4. Document migration patterns from multi-index → KV for greenfield contracts.
