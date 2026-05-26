---
id: retained-core
title: Retained Core (Low Breakage)
parent: longhorn
status: in_progress
progress: 80
order: 0
tags: [release, retained]
---

## User Story

As a contract author who already ships on Antelope, I want my existing CDT-compiled contracts to keep working on Longhorn with zero changes.

## Problem Statement

Forks frequently break the surface contracts depend on (intrinsics, ABI shape, signature recovery, account-name rules). Every break costs the whole ecosystem.

## Solution Statement

Longhorn explicitly preserves the four pillars contracts depend on — account names, the permission system, the subjective resource model, and the WASM + CDT runtime — and only extends them additively.

## Reference Contracts

- [`AntelopeIO/reference-contracts`](https://github.com/AntelopeIO/reference-contracts) — base.
- [`AntelopeIO/cdt`](https://github.com/AntelopeIO/cdt) — toolchain.

## Implementation Steps

1. Pin Spring + CDT versions used as the baseline.
2. Run the reference-contracts test suite against every Longhorn build; gate releases on a clean pass.
3. Document every addition as "additive only" with a compatibility note in the release notes.
4. Track each pillar as a child node so progress is visible.
