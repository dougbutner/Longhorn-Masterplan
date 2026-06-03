---
id: enhanced-resources
title: Enhanced Resource Model
parent: longhorn
status: in_progress
progress: 10
order: 3
tags: [divergence, resources, onboarding]
source:
  path: flavors/Annie/contracts/eosio.subsidy/README.md
  url: https://github.com/dougbutner/Longhorn-Masterplan/blob/main/flavors/Annie/contracts/eosio.subsidy/README.md
---

## User Story

As a brand-new account, my first few transactions feel free — the chain underwrites me until I have skin in the game.

## Problem Statement

Subjective billing requires CPU/NET stake or PowerUp to transact. A freshly materialized account has neither, so the first action after onboarding hits a wall. That wall is the second-biggest onboarding tax after lazy accounts.

More Problems: 
- Notification handling, inline action notifications causing history solutions heavy burden, bloat that may be avoided from BP overhead

Systemic Question
- Can we avoid storing EVERYTHING in state??
Idea: Categorizing different types of things to store by contract or data type? Whitelisting / blacklisting specific contract’s table from nodes needing to have them (Example: ignoring all exsat stuff on Vaulta) 


## Solution Ideas 

Matt W 
More flexibility at protocol-level 
Problem: new chains need to fit into the current protocol resource model, making need for extra level like 
“Use it or lose it” incentivizes spamming to use unused resources over time. 
Solution: Move protocol-level resource management into system contracts 
Reconsider how we are storing state data 
Tradeoff of system contracts: Not as efficient as protocol in reading CPU and other resources in accounts. 


Chris 
Idea: How can we keep stake-for-resource model (huge draw) without it being abused 
Possible Solution: App-sponsored resources 
Explore Hybrid


Michael 
Problem: History solutions are required to store a TON of data even for delta-neutral (RAM) TXs 
Solutions: Billing for state usage (moving around stuff in RAM) - not just final amount of ram  (Matching the real-world cost of running nodes) 

Douglas 
Idea: Signing paradigm within the contract (like tonomy) so contract can sign the transaction 
Modifying the require_auth() to allow prelisted contracts to pay for resources or dual-signing 
L2: Idea: Improve the storage format for the inline actions using lossless compression and alternative data format (JSON wastes characters that add up) 
Radical Idea: Purge/ignore as much as we can after a period of time / contract, which would require additional resources to resurface into state but not leave the system. 
Allow for RAM to be allocated to accounts and deployed in separate system (also helps idea of having RAM) so RAM can be sold and bought in one market, and deployed in another



## Final Solution Statement 



## Reference Contracts

- [`AntelopeIO/reference-contracts`](https://github.com/AntelopeIO/reference-contracts) — `eosio.system::delegatebw`, `buyrambytes`.

## Implementation Steps

1. Stand up `eosio.subsidy` as a privileged contract.
2. Implement `grant_free_tier(receiver, cpu_ms, net_bytes)` callable from `eosio.system::newaccount`.
3. Token-bucket per account, refilled every block based on `set_curve(curve_id, params)`.
4. Wire bucket lookup into CPU/NET accounting so contracts see "the user has some stake".
5. BP vote action to update curves; no hard fork.

