---
id: lazy-account-materialization
title: Lazy account materialization
status: not_started
progress: 10
owners: [annie]
depends_on: [flavor-annie]
tags: [chain, contracts]
---

# Lazy account materialization

Transfers to a *non-existent* account (key-derived or `@username`) auto-create that account on the first action, billed from the transferred balance.

## Contract surface

```cpp
// eosio.system
void create_account(name creator, name newacc, public_key key, bool lazy = true);

// eosio.token (notify handler)
void on_transfer(name from, name to, asset quantity, std::string memo) {
    // 1. if `to` doesn't exist:
    //    a. derive account name from `to` (it IS the public key form)
    //    b. call create_account(self, to, key, lazy=true)
    //    c. charge the materialization fee from `quantity`
    // 2. credit the remaining quantity to `to`
}
```

## Open design questions

- How to encode "the destination is a public key, not a name". Proposal: detect `EOS*` / `PUB_*` prefix on `to` and route to a `materialize` action. The user pastes the public-key string as the account name.
- Long account names — chain stores a `hash → key` table so transfers to long `@names` still resolve in 64 bits internally.
- Reaping rules for accounts that never act after materialization (no rent until first use).

## References

- XPRNetwork lazy-account precedent (see `flavors/Annie/upstream/proton.contracts/`).
- Tonomy passkey-only account flow.
