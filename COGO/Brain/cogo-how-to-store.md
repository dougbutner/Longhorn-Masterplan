# Memory storage

**Store:** Long-term decisions, prefs, repeated corrections, lessons, architecture.

**Skip:** Ephemeral tasks, verbose logs, duplicates, filler.

**Rules:** Short summaries; update only long-term value; reinforce repeats.

## Longhorn Masterplan storage map (where things live)

- **Design / spec** → `masterplan/<id>.md` (frontmatter: `id`, `title`, `status`, `progress`, `owners`, `depends_on`, `tags`). Drives the D3 map. Update `progress` / `status` whenever you ship a change.
- **Chain code** → `flavors/<flavor>/contracts/<contract>/`. Annie is the first flavor. Each contract README declares `Upstream:` + `Upstream-path:` for `diff-upstream.sh`.
- **Upstream sources** → `flavors/<flavor>/upstream/` (git-ignored; populated by `flavors/scripts/pull-references.sh`).
- **Frontend** → `frontend/`. Reads `masterplan/*.md` through `scripts/build-plan.ts`; outputs `src/data/plan.json`.
- **Governance** → `CONTRIBUTORS.json` (root), `.github/PULL_REQUEST_TEMPLATE.md`, `.github/workflows/pr-vaulta-name.yml`, `.github/CODEOWNERS`.
- **Active context** → `COGO/Current-Project.md`.

Conventions: one concept per masterplan MD, kebab-case ids, every PR title starts `[<vaultaname>]`, every contract README declares its upstream lineage.
