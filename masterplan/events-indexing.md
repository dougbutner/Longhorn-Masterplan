---
id: events-indexing
title: Events & indexing
status: not_started
progress: 5
owners: [annie]
depends_on: [flavor-annie]
tags: [chain, indexing]
---

# Events & indexing

Antelope's history is action-traces + inline-actions. Annie adds an explicit **event** primitive so indexers don't have to reverse-engineer state changes from action data.

## Surface

```cpp
// any contract
void emit_event(name event_type, bytes data);
```

- Events are recorded in the block as a separate vector alongside action traces.
- Schema is described by `eosio.events::register_schema(name event_type, std::string abi_fragment)`.

## Why

- Existing indexers (Hyperion, Antelope-Eosio-Indexer, Dfuse) currently match on action names + memo conventions. Events make schema explicit.
- KV reads inside contracts don't show up in action traces; events let contracts say "this state changed" directly.

## Off-chain

- `nodeos` ships a websocket of events filtered by `event_type` / `account`.
- Indexers can subscribe instead of replaying full history when they only care about a subset.

## Compatibility

- Strict superset. Old contracts emit no events; old indexers ignore them.
