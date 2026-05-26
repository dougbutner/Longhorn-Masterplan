---
id: jungle4-testing
title: Testing on Jungle 4
parent: longhorn
status: in_progress
progress: 30
order: 11
tags: [testing]
---

## User Story

As a builder, I validate every Longhorn divergence against a live testnet that mirrors Antelope semantics before any of it touches mainnet.

## Problem Statement

Testing chain-level divergences without a public testnet is slow and lossy — local nodeos doesn't reproduce real-world peer dynamics.

## Solution Statement

Use [Jungle 4](https://jungle4.unicove.com) as the canonical integration target. It is Anchor-compatible, supports web-based free account creation via APIs (paid via smart contract), custom session keys, and mnemonic support. Native lazy materialization + key-as-account-name will significantly improve passkey / web-authenticator onboarding once landed.

## Reference Links

- Signup / Wallet: [jungle4-account.unicove.com](https://jungle4-account.unicove.com)
- Explorer / dApp: [jungle4.unicove.com](https://jungle4.unicove.com)

## Implementation Steps

1. Stand up a Longhorn-flavored Jungle 4 leaf so divergences are testable without disturbing the canonical Jungle 4.
2. CI deploys every PR's contracts to that leaf and runs an integration suite.
3. Once a feature is green there, mark its node `done` here.
