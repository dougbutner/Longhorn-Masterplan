# eosio.passkey (Annie)

Status: scaffolding
Upstream: Tonomy-Foundation/Tonomy-ID (permissions library) + new code
Upstream-path: tonomy-id

## Annie additions

- `set_permission_logic(account, permission, wasm_logic)` — user-supplied permission programs.
- `auth_passkey(account, sig, data)` — WebAuthn signature verification path.
- Stores credential descriptors in `eosio.kv` for cheap lookup.
