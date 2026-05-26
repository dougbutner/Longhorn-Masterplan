---
id: collaboration-flow
title: Collaboration flow
status: not_started
progress: 5
owners: []
depends_on: [pr-governance, vaulta-auth]
tags: [governance, process]
---

# Collaboration flow

How a contributor goes from "I want to help" → merged code.

## 1. Add yourself

Open `CONTRIBUTORS.json` and add your entry with a vaulta name, github handle, and a color hex.

```json
"yourname": { "color": "#a855f7", "github": "yourname", "vaulta": "yourname.evm" }
```

PR title: `[yourname] add contributor entry`.

## 2. Sign in to the UI

`pnpm dev` in `/frontend`, click **Sign in**, pick Anchor or WebAuthn. Activate lights up; your pill appears top-right.

## 3. Claim a node

Find a node in the map. Click → side panel → **Claim**. The UI opens a PR draft titled `[yourname] claim <node-id>` that adds your vaulta to that file's `owners` and bumps `status` to `in_progress`.

## 4. Build the flavor work

If you're working on a chain change, it lives under `flavors/Annie/contracts/<contract>/`. Reference the upstream you forked from in your PR body so reviewers can diff against it.

## 5. Update progress as you ship

Bump the `progress` value in the masterplan MD's frontmatter. The map turns greener. Open another PR `[yourname] progress <node-id>: NN%`.

## 6. Review

The CODEOWNERS for the file you touched are auto-requested. PRs land via squash merge so the activity feed stays clean.
