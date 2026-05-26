---
id: fractal-governance
title: Human Layer Governance (Fractal-style)
parent: longhorn
status: not_started
progress: 5
order: 8
tags: [divergence, governance]
---

## User Story

As a community member on Longhorn, I propose how a slice of token-fee inflation gets spent, my peers vote, and approved proposals fund themselves directly from the community treasury. Multi-chain communities aggregate the same way.

## Problem Statement

Top-down BP voting concentrates control at the consensus layer. Treasury funding is opaque and slow. Fractally / Eden on EOS showed that smaller, recursive human-layer governance scales to real-world coordination — that pattern deserves to be a first-class chain feature, not a one-off contract.

## Solution Statement

Native fractal-governance contract layered on top of Reflection-Backed Tokens. Communities are registered groups; proposals draw from the community fund accumulated via reflection fees + inflation. Voting is recursive (sub-groups within groups) and cross-chain via the IBC primitives shipped under Consensus Tweaks.

## Reference Contracts

- Fractally / Eden on EOS (design precedent, off-chain).

## Implementation Steps

1. `eosio.fractal::register_community(name, parent_community)` for nested groups.
2. `propose_fractal(community, funding, payload)` — submit a proposal.
3. `vote_fractal(voter, proposal_id, approve)` — weighted by community membership.
4. `distribute_inflation(community, amount)` — settles approved proposals from the community fund.
5. IBC bridge for proposals/votes that span chains.
