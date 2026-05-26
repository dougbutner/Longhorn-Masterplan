---
id: events-indexing
title: Events & Indexing
parent: longhorn
status: in_progress
progress: 5
order: 5
tags: [divergence, indexing]
source:
  path: flavors/Annie/contracts/eosio.events/README.md
  url: https://github.com/dougbutner/Longhorn-Masterplan/blob/main/flavors/Annie/contracts/eosio.events/README.md
---

## User Story

As an indexer operator, I subscribe to a structured stream of typed events emitted by contracts, and I never have to re-derive state by replaying action traces.

## Problem Statement

Antelope history exposes action traces and inline actions, but state changes inside contracts (especially in KV tables) aren't visible without re-running the contract's logic. Indexers end up matching on action names and parsing memos to guess at intent.

## Solution Statement

A native `emit_event(event_type, data)` primitive recorded alongside action traces in every block. Schemas are registered on chain via `eosio.events::register_schema`, so off-chain consumers know exactly how to decode each event. `nodeos` exposes a filtered websocket so indexers subscribe to just the slices they care about.

## Reference Contracts

- New — no direct upstream.

## Implementation Steps

1. Add an `events` vector to the block format (additive).
2. Implement `eosio.events::register_schema(event_type, abi_fragment)` privileged action.
3. Add `emit_event(event_type, data)` callable inline from any contract.
4. Expose a websocket on `nodeos` with subscription filtering by `account` + `event_type`.
5. Provide a TS SDK helper for consumers (decoder + reconnect/backoff).
