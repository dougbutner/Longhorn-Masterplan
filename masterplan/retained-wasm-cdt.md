---
id: retained-wasm-cdt
title: WASM + CDT Baseline
parent: retained-core
status: done
progress: 100
order: 3
tags: [retained]
---

## User Story

As a contract developer, I want to compile against the same CDT, link the same intrinsics, and deploy with the same ABI shape as I do on EOS / Vaulta / WAX today.

## Problem Statement

A fork that touches the WASM VM, intrinsic set, or ABI format forks the developer ecosystem too.

## Solution Statement

Pin to AntelopeIO's CDT and WASM runtime. Every Longhorn addition (KV intrinsics, event emission, passkey verification) is layered as an additional intrinsic / contract — never a replacement.

## Reference Contracts

- [`AntelopeIO/cdt`](https://github.com/AntelopeIO/cdt) — contract development toolkit.
- [`AntelopeIO/spring`](https://github.com/AntelopeIO/spring) — node + VM.

## Implementation Steps

1. Pin a CDT release tag in `flavors/Annie/scripts/build.sh`.
2. Add new intrinsics in a numbered namespace so contracts that don't import them keep compiling.
3. Run upstream ABI-compatibility tests on every PR.
