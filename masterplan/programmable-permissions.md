---
id: programmable-permissions
title: Programmable permissions + passkeys
status: not_started
progress: 10
owners: [annie]
depends_on: [flavor-annie]
tags: [chain, contracts, passkey]
---

# Programmable permissions + native passkey support

Extensible auth logic — permissions are evaluated by user-supplied WASM, and WebAuthn / passkey signatures are first-class on chain.

## Contract surface

```cpp
// eosio.passkey
void set_permission_logic(name account, name permission, std::vector<uint8_t> wasm_logic);
void auth_passkey(name account, signature sig, bytes data);
```

## Design notes

- **WASM permission programs** receive `(action, context)` and return `bool authorized`. The on-chain VM is the same WASM runtime used for contracts, sandboxed harder (no DB writes).
- **WebAuthn keys** are stored alongside K1/R1 keys; the existing `permission_level_weight` carries an additional kind flag.
- The `Longhorn wallet → passkey → first action → materialize` path described in `chain-passkey-flow.md` is implemented by `auth_passkey` + the lazy-create hook.

## Compatibility

- Existing keyed permissions keep working — programmable permissions are *additive*.
- Off-chain tooling (history, indexers) must learn about the new sig type; we ship a `kind` byte ahead of the signature payload for forward compatibility.

## References

- Tonomy permissions library — `flavors/Annie/upstream/tonomy-id/`.
- Web standards: WebAuthn level 2, COSE algs (ES256, EdDSA).
