---
id: reference-repos
title: Reference repositories
status: in_progress
progress: 70
owners: [dougbutner]
depends_on: [flavor-annie]
tags: [chain, references]
---

# Reference repositories

The canonical upstreams Annie pulls from. `flavors/scripts/pull-references.sh` will clone these into `flavors/Annie/upstream/` so contributors can diff against them.

## Core Antelope foundation (must-have)

- **AntelopeIO/reference-contracts** — Official reference system contracts (`eosio.system`, `eosio.token`, `eosio.boot`). The primary base for any fork.
- **AntelopeIO/spring** — Main Antelope node software (protocol implementation with Savanna consensus).
- **AntelopeIO/cdt** — Contract Development Toolkit (C++ for smart contracts).

## Major forks & custom system contracts

- **worldwide-asset-exchange/wax-system-contracts** — WAX system contracts (perf / NFT-focused tweaks).
- **XPRNetwork/proton.contracts** — Identity, lazy accounts, payments.
- **XPRNetwork/ts-smart-contracts** — TypeScript smart contracts (KV storage, modern patterns).
- **XPRNetwork/proton.token** — Token contract examples.
- **Wire-Network/wire-system-contracts** — WIRE system contracts (universal transaction layer, deeper divergences).
- **VaultaFoundation/system-contracts** — Vaulta-specific system contracts (sibling positioning reference).
- **Tonomy-Foundation/Tonomy-ID** — Tonomy ID & governance (identity, passkeys, programmable permissions).

## Additional

- **eosnetworkfoundation/eos-system-contracts** — ENF-maintained system contracts (frequent updates).
- **InfraBlockchain/infrablockchain** — Another Antelope fork with custom system contracts.

## Strategy

Start with **AntelopeIO/reference-contracts** as the base. Layer:

- **XPRNetwork** for lazy accounts + identity.
- **Tonomy** for passkeys / programmable permissions.
- **WAX** for perf tuning hooks.
- **WIRE** for the more aggressive protocol ideas (cherry-picked).
- **Vaulta** for parity where it makes sense.

Each contract under `flavors/Annie/contracts/<name>/README.md` declares its upstream lineage so we can keep diffs auditable.
