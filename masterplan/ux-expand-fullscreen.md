---
id: ux-expand-fullscreen
title: Node expand / contract & fullscreen
status: not_started
progress: 5
owners: []
depends_on: [d3-progress-map]
tags: [frontend, ux]
---

# Node expand / contract & fullscreen

Two related affordances that keep the map readable as the plan grows.

## Expand / contract

- Every node has a `collapsed` boolean in viz state.
- Collapsing a node hides all transitive descendants and badges the node with a `+N` chip showing how many were hidden.
- Buttons in the top bar: **Expand all**, **Collapse all**, **Collapse to depth N**.
- Keyboard: `E` (expand all), `C` (collapse all), `[` / `]` (depth−/+).

## Fullscreen

- `requestFullscreen()` on the map container.
- While fullscreen, the side panel slides into an overlay drawer.
- Esc exits; the F key toggles.
- Persist fullscreen pref in `localStorage`.

## Accessibility

- Honor `prefers-reduced-motion` (no pulse halo, instant transitions).
- All controls reachable by Tab; ARIA labels on every icon button.
