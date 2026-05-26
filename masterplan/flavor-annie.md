---
id: flavor-annie
title: Annie flavor overview
status: in_progress
progress: 25
owners: [annie]
depends_on: []
tags: [chain, flavor, annie]
---

# Annie — first complete build

**Annie** is the inaugural flavor under `/flavors`. It is a **low-breakage Antelope fork** that retains the parts of Antelope developers depend on while pulling in the best ideas from neighboring forks.

## Retained core (low breakage)

- 12-character account names (plus support for human-readable `@names` and hashed/long accounts).
- Permission system kept and extended for programmability.
- Subjective resource model (CPU/NET/RAM), mostly transparent to contracts.
- WASM + CDT baseline for maximum contract compatibility.

## Divergences (Annie's value-add)

| Feature | Spec node |
|---|---|
| Lazy account materialization | [`lazy-account-materialization.md`](./lazy-account-materialization.md) |
| Programmable permissions + native passkeys | [`programmable-permissions.md`](./programmable-permissions.md) |
| Enhanced resource model (free tier, better staking) | [`enhanced-resource-model.md`](./enhanced-resource-model.md) |
| KV storage alongside multi-index | [`kv-storage-model.md`](./kv-storage-model.md) |
| Richer events / indexing primitives | [`events-indexing.md`](./events-indexing.md) |
| Custom system contracts (identity, lazy, passkey) | [`custom-system-contracts.md`](./custom-system-contracts.md) |
| Faster finality + IBC tweaks | [`consensus-protocol-tweaks.md`](./consensus-protocol-tweaks.md) |

## Build layout

```
flavors/Annie/
  README.md                 # quick-start
  contracts/
    eosio.system/           # Annie overlay on AntelopeIO/reference-contracts
    eosio.token/
    eosio.boot/
    eosio.proton/           # identity / lazy accounts (from XPRNetwork)
    eosio.passkey/          # programmable permissions / WebAuthn (from Tonomy)
    eosio.kv/               # KV storage helpers (from XPRNetwork ts-smart-contracts)
    eosio.events/           # event emitter (new)
  upstream/                 # populated by flavors/scripts/pull-references.sh
    antelope-reference-contracts/
    spring/
    cdt/
    wax-system-contracts/
    proton.contracts/
    ts-smart-contracts/
    wire-system-contracts/
    vaulta-system-contracts/
    eos-system-contracts/
    tonomy-id/
    infrablockchain/
  scripts/
    build.sh                # builds each contract via CDT
    diff-upstream.sh        # shows divergence vs each upstream
```

## Status

This file tracks the rollup. Each contract has its own README in `flavors/Annie/contracts/<name>/` with status, owners, and the upstream(s) it derives from.
