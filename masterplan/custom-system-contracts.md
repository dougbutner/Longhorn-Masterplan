---
id: custom-system-contracts
title: Custom system contracts
status: not_started
progress: 10
owners: [annie]
depends_on: [flavor-annie, lazy-account-materialization, programmable-permissions]
tags: [chain, contracts]
---

# Custom system contracts

Annie's privileged contracts extend stock Antelope without rewriting them.

## Contracts

| Contract        | Role | Derived from |
|-----------------|------|--------------|
| `eosio.system`  | core resources, BP voting, account ops | `AntelopeIO/reference-contracts` + WAX & ENF |
| `eosio.token`   | fungible tokens + `on_transfer` lazy hook | `AntelopeIO/reference-contracts` |
| `eosio.boot`    | bootstrap (genesis) | `AntelopeIO/reference-contracts` |
| `eosio.proton`  | identity / `@names` / KYC verification | `XPRNetwork/proton.contracts` |
| `eosio.passkey` | programmable permissions, WebAuthn auth | Tonomy permissions + new code |
| `eosio.kv`      | KV helpers, TS table sugar | `XPRNetwork/ts-smart-contracts` |
| `eosio.events`  | event registry + emit                  | new |
| `eosio.subsidy` | free-tier CPU/NET billing               | new |

## Privileged actions (excerpt)

```cpp
// eosio.proton
void verify_identity(name account, bytes proof);
void set_verified(name account, bool status);

// eosio.system
void create_account(name creator, name newacc, public_key key, bool lazy = true);
void on_transfer(name from, name to, asset quantity, std::string memo);

// eosio.passkey
void set_permission_logic(name account, name permission, std::vector<uint8_t> wasm_logic);
void auth_passkey(name account, signature sig, bytes data);
```

## Build

Each contract sits in `flavors/Annie/contracts/<name>/`. The `flavors/Annie/scripts/build.sh` script invokes CDT for each contract and outputs WASM + ABI to `flavors/Annie/build/`.
