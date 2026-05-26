---
id: enhanced-resource-model
title: Enhanced resource model
status: not_started
progress: 5
owners: [annie]
depends_on: [flavor-annie, lazy-account-materialization]
tags: [chain, resources]
---

# Enhanced resource model

Keep the subjective CPU/NET/RAM model contracts depend on, but smooth the new-user cliff and tighten staking dynamics.

## Surface

```cpp
// eosio.system
void delegatebw(name from, name receiver, asset stake_net, asset stake_cpu);
void buyrambytes(name payer, name receiver, uint32_t bytes);

// Annie additions
void grant_free_tier(name receiver, uint32_t cpu_ms, uint32_t net_bytes); // privileged
void set_subsidy_curve(uint8_t curve_id, std::vector<uint64_t> params);   // bp-governed
```

## Free tier

- Newly materialized accounts get a small CPU / NET allotment paid by `eosio.subsidy`.
- Allotment scales with current chain load; it can drop to zero when the chain is hot.
- Implementation: a token bucket keyed by account, refilled every block, capped per account.

## Tuned staking

- Existing `delegatebw` semantics preserved.
- New: continuous redelegation (no 3-day unstake delay for sub-threshold amounts).
- Curves stored on chain; tuneable via BP vote without a hard fork.

## Compatibility

Contracts that read CPU/NET/RAM via existing intrinsics see no change. The free tier looks like "the user happens to have a bit of stake".
