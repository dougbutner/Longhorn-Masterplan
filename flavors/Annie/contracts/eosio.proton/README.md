# eosio.proton (Annie)

Status: scaffolding
Upstream: XPRNetwork/proton.contracts
Upstream-path: proton.contracts/contracts/eosio.proton

## Annie additions

- `verify_identity` / `set_verified` retained.
- `@name` registry table cross-linked with `eosio.passkey` so a Vaulta name maps to one or more passkey credentials.
- Used by the masterplan UI's CONTRIBUTORS list as the source-of-truth for "is this a real vaulta account".
