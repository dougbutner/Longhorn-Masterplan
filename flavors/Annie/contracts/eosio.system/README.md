# eosio.system (Annie)

Status: scaffolding
Upstream: AntelopeIO/reference-contracts + worldwide-asset-exchange/wax-system-contracts + eosnetworkfoundation/eos-system-contracts
Upstream-path: antelope-reference-contracts/contracts/eosio.system

## Annie additions

- `create_account(... bool lazy = true)` — lazy account materialization (see masterplan `lazy-account-materialization`).
- `on_transfer(...)` — token notify hook that auto-creates accounts whose name is a public-key string.
- Hooks into `eosio.subsidy` for the free CPU/NET tier on materialized accounts.
- Continuous redelegation for sub-threshold stake (see masterplan `enhanced-resource-model`).

## Source

Skeleton in `src/eosio.system.cpp`; build with `flavors/Annie/scripts/build.sh`.
