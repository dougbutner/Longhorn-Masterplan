---
id: contributor-colors
title: Contributor colors
status: not_started
progress: 10
owners: []
depends_on: [pr-governance]
tags: [frontend, governance]
---

# Contributor colors

Each vaulta name is bound to a hue. The UI uses the color to:

- Stroke the node a contributor most recently pushed to.
- Tint their name pill in the header.
- Color-band entries in the activity sidebar ("who pushed what").

## Source of truth

`CONTRIBUTORS.json` at the repo root:

```json
{
  "annie":       { "color": "#e11d48", "github": "annie",       "vaulta": "annie.evm" },
  "dougbutner":  { "color": "#0ea5e9", "github": "dougbutner",  "vaulta": "doug.evm" }
}
```

## Who-pushed-what

The frontend reads the merged-PR log (`git log --pretty=...`) baked into `frontend/src/data/activity.json` at build time. Each entry: `{ sha, vaulta, files: [...], timestamp }`. Side panel surfaces "Last pushed by `annie` 2h ago" with the color.

## Picking colors

- Choose distinct hues > 30° apart on OKLCH; avoid red/green confusion for accessibility.
- Document the choice next to your name when adding yourself in `CONTRIBUTORS.json`.
