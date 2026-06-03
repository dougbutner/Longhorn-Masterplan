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



## Final Solution Statement 



## Reference Contracts

- [`AntelopeIO/reference-contracts`](https://github.com/AntelopeIO/reference-contracts) — `eosio.system::delegatebw`, `buyrambytes`.

## Implementation Steps


