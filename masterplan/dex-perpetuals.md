---
id: dex-perpetuals
title: Native Perpetuals
parent: dex-mechanics
status: not_started
progress: 0
order: 1
tags: [dex]
---

## User Story

As a trader, I open a leveraged long/short on Longhorn through a single action — no bridge, no off-chain oracle hops, no app-layer signer.

## Problem Statement

Perpetuals on every other chain are app-layer contracts that re-invent funding rates, liquidations, and oracle integration. Each implementation has subtly different economics.

## Solution Statement

`execute_perp(trader, pair, is_long, size)` is a native DEX action. Funding rates are computed by the chain from on-chain oracle prices (pluggable). Liquidations are deterministic and called by anyone for a fee.

## Reference Contracts

- New.

## Implementation Steps

1. Standard oracle interface + adapter for at least two price sources.
2. Per-pair config (max leverage, funding curve).
3. Open/close + liquidation actions; emit events for indexers.
4. Risk parameters governed by Fractal Governance.
