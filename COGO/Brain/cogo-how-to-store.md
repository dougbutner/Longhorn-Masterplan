# Memory storage

**Store:** Long-term decisions, prefs, repeated corrections, lessons, architecture.

**Skip:** Ephemeral tasks, verbose logs, duplicates, filler.

**Rules:** Short summaries; update only long-term value; reinforce repeats.

## Longhorn Masterplan storage map (where things live)

- **Design / spec** → `masterplan/<id>.md`. Frontmatter: `id`, `title`, `parent`, `status`, `progress`, `order`, `tags`, optional `source: { path, url }`. Drives the D3 map. Three-level cap (root → feature → sub-feature). Update `progress`/`status` whenever you ship.
- **Chain code (the actual contracts)** → `flavors/<flavor>/contracts/<contract>/`. Annie is the implementation slot. Each contract README declares `Upstream:` + `Upstream-path:` for `diff-upstream.sh`.
- **Upstream sources** → `flavors/<flavor>/upstream/` (git-ignored; populated by `flavors/scripts/pull-references.sh` via sparse-checkout).
- **Frontend** → `frontend/`. Reads `masterplan/*.md` and mirrors each `source.path` into the rendered body via `scripts/build-plan.ts`; outputs `src/data/plan.json`.
- **Governance** → `CONTRIBUTORS.json` (root), `.github/PULL_REQUEST_TEMPLATE.md`, `.github/workflows/pr-vaulta-name.yml`, `.github/CODEOWNERS`.
- **Active context** → `COGO/Current-Project.md`.

Conventions:
- The website only shows Longhorn + release features. The flavor folder is invisible to viewers; it's where the code that feeds `source.path` actually lives.
- One concept per masterplan MD, kebab-case ids.
- Every PR title starts `[<vaultaname>]`.
- Every contract README declares its upstream lineage.
