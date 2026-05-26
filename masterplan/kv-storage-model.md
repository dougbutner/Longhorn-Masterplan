---
id: kv-storage-model
title: KV storage model
status: not_started
progress: 5
owners: [annie]
depends_on: [flavor-annie]
tags: [chain, storage]
---

# KV storage model

A first-class key-value store alongside Antelope's existing multi-index tables.

## TypeScript surface (XPRNetwork-style)

```ts
@table("kvstore")
class KVStore {
  @primaryKey
  key: Bytes;

  value: Bytes;

  @secondary
  owner: Name;
}
```

## C++ surface

```cpp
struct [[eosio::table]] kvstore {
    bytes key;
    bytes value;
    name  owner;

    uint64_t primary_key() const { return std::hash<bytes>{}(key); }
};
```

## Why both?

- The TS-style decorator API gives a modern developer experience (XPRNetwork has shown it works at scale).
- The C++ struct keeps wire-format parity with reference contracts.

## Use cases

- Identity bindings (`vaulta name → passkey set`).
- Inbound transfer routing for lazy materialization (`incoming_key_string → metadata`).
- Arbitrary contract state without designing a multi-index from scratch.

## Cost

Same RAM-billing model as multi-index. Per-entry overhead lower because no secondary-index trees by default; opt-in `@secondary` adds them.
