# Longhorn Masterplan

A tree of release features. Every file in this folder is a node; every node carries YAML frontmatter the website's D3 map reads:

```yaml
---
id: lazy-accounts                  # unique slug, matches filename
title: Lazy Account Materialization
parent: longhorn                   # null = root; otherwise the id of the parent node
status: in_progress                # not_started | in_progress | review | done
progress: 15                       # 0–100, drives orange → green
order: 1                           # sibling order; lower = closer to parent
tags: [divergence, onboarding]
source:                            # optional; site mirrors this file's contents
  path: flavors/Annie/contracts/eosio.system/src/eosio.system.cpp
  url:  https://github.com/dougbutner/Longhorn-Masterplan/blob/main/flavors/Annie/contracts/eosio.system/src/eosio.system.cpp
---
```

Hierarchy is at most three levels deep:

```
longhorn (root)
└── retained-core
│   ├── retained-account-names
│   ├── retained-permissions
│   ├── retained-resources
│   └── retained-wasm-cdt
├── lazy-accounts
├── programmable-permissions
├── enhanced-resources
├── kv-storage
├── events-indexing
├── custom-system-contracts
│   ├── identity-verification
│   └── lazy-passkey-actions
├── reflection-tokens
├── fractal-governance
├── dex-mechanics
│   ├── dex-pool-locking
│   ├── dex-perpetuals
│   └── dex-fee-bypass
├── consensus-tweaks
└── jungle4-testing
```

## Body template

Every feature MD uses the same human-written body:

1. **User Story** — who benefits, in one sentence.
2. **Problem Statement** — what's broken without this feature.
3. **Solution Statement** — what we ship.
4. **Reference Contracts** — upstream code we draw from.
5. **Implementation Steps** — ordered checklist.

Two more sections are appended automatically by `frontend/scripts/build-plan.ts` when `source.path` is set:

6. **Full code snippet** — verbatim contents of the source file (always mirrors the real code).
7. **Update with changes** — direct link to the source file in the repo.

## Editing rules

- One concept per file; keep nodes short.
- Always update `progress` and `status` when you ship.
- New nodes? Add the file, set its `parent`, and open a PR with `[<your-vaulta-name>]` in the title.
- Don't break the 3-level cap; if something feels deeper, it probably wants its own peer.
