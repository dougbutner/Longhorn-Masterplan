# Annie — first complete flavor

Annie is the inaugural flavor: a **low-breakage Antelope fork** with lazy account materialization, native passkey/WebAuthn permissions, an enhanced resource model, KV storage, richer events, and a Vaulta-style identity layer.

Read the masterplan for the full spec:

- [`../../masterplan/flavor-annie.md`](../../masterplan/flavor-annie.md)
- [`../../masterplan/chain-passkey-flow.md`](../../masterplan/chain-passkey-flow.md)
- [`../../masterplan/lazy-account-materialization.md`](../../masterplan/lazy-account-materialization.md)
- [`../../masterplan/programmable-permissions.md`](../../masterplan/programmable-permissions.md)
- [`../../masterplan/enhanced-resource-model.md`](../../masterplan/enhanced-resource-model.md)
- [`../../masterplan/kv-storage-model.md`](../../masterplan/kv-storage-model.md)
- [`../../masterplan/events-indexing.md`](../../masterplan/events-indexing.md)
- [`../../masterplan/custom-system-contracts.md`](../../masterplan/custom-system-contracts.md)
- [`../../masterplan/consensus-protocol-tweaks.md`](../../masterplan/consensus-protocol-tweaks.md)
- [`../../masterplan/reference-repos.md`](../../masterplan/reference-repos.md)

## Build prereqs

- [Antelope CDT](https://github.com/AntelopeIO/cdt) ≥ 4.0
- CMake ≥ 3.16, clang ≥ 16
- (For local node tests) [AntelopeIO/spring](https://github.com/AntelopeIO/spring)

## One-time setup

```bash
# from repo root
flavors/scripts/pull-references.sh Annie all   # sparse-pull all system contracts from each upstream
flavors/Annie/scripts/build.sh            # compile all contracts via CDT
```

## Contracts

| Contract        | Folder                         | Status      | Upstream lineage |
|-----------------|--------------------------------|-------------|------------------|
| eosio.system    | `contracts/eosio.system/`      | scaffolding | AntelopeIO/reference-contracts + WAX + ENF |
| eosio.token     | `contracts/eosio.token/`       | scaffolding | AntelopeIO/reference-contracts |
| eosio.boot      | `contracts/eosio.boot/`        | scaffolding | AntelopeIO/reference-contracts |
| eosio.proton    | `contracts/eosio.proton/`      | scaffolding | XPRNetwork/proton.contracts |
| eosio.passkey   | `contracts/eosio.passkey/`     | scaffolding | Tonomy permissions + new |
| eosio.kv        | `contracts/eosio.kv/`          | scaffolding | XPRNetwork/ts-smart-contracts |
| eosio.events    | `contracts/eosio.events/`      | scaffolding | new |
| eosio.subsidy   | `contracts/eosio.subsidy/`     | scaffolding | new |
