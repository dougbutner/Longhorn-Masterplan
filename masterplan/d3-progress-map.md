---
id: d3-progress-map
title: D3 progress map
status: in_progress
progress: 45
owners: [dougbutner]
depends_on: [frontend-overview]
tags: [frontend, d3, viz]
---

# D3 progress map

A **force-directed graph** of the masterplan. Each `masterplan/*.md` becomes one node; each `depends_on` becomes one directed edge.

## Visual encoding

| Channel  | Meaning |
|----------|---------|
| Fill     | `progress` mapped through `d3.interpolateRgb("#f97316", "#22c55e")` (orange → green) |
| Radius   | `12 + (progress / 100) * 18` |
| Stroke   | Last pusher color from `CONTRIBUTORS.json` |
| Halo     | Pulses while `status === "in_progress"` |
| Icon     | `done` ✓, `review` ◐, `in_progress` ◔, `not_started` ○ |

## Interactions

- **Click** → opens the markdown body in the side panel.
- **Double-click** → toggles the node's subtree expand/contract.
- **Drag** → repositions the node (sticky after release).
- **Hover** → highlights direct ancestors + descendants.
- **`F`** → fullscreen toggle.
- **`E` / `C`** → expand-all / collapse-all.

## Implementation pointers

- `frontend/src/viz/ProgressMap.tsx` — React wrapper, owns refs.
- `frontend/src/viz/forceLayout.ts` — `d3-force` simulation (charge -250, link distance 90).
- `frontend/src/viz/colorScale.ts` — interpolators + contributor color lookup.
- Resize observer keeps the SVG sized to its container, including fullscreen.
