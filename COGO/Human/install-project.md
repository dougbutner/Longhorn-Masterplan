# Install / rewrite (brownfield)

**Refs:** `safety-and-confirmations.md`, `stack-detection-checklist.md`, `migration-playbook.md`, `project-constraints-template.md`, `example-env.md` (names only).

## Shared rules

No unrelated edits. Infer stack (`stack-detection-checklist.md`). Prefer incremental migration (`migration-playbook.md`). Keep rollback. Confirm when unsure.

## Workflow A — `/install-project`

1. **Repo:** Scan root + configs; infer FE/BE/DB/auth/deploy (`stack-detection-checklist.md`).
2. **Profile:** Fill `COGO/Current-Project.md` (Objective, Focus, Decisions, Blockers, Next). Update `Build/*` for detected stack. Append env **names** to `example-env.md` (no secrets).
3. **Context:** Tie architecture to COGO docs; note constraints/prefs.
4. **Out:** Stack summary; files touched; first recommended task.

## Workflow B — `/rewrite-project`

**Inputs:** Source stack (infer if needed); **target stack** (required); constraints (time, downtime, compatibility).

1. **Analyze:** Map architecture/deps; flag auth/data/billing/jobs/API risks.
2. **Plan:** Use `migration-playbook.md`. Deliver target architecture; old→new map; phased steps; data migration; test + rollback.
3. **Execute:** Vertical slices; runnable checkpoints; tests per phase.
4. **Out:** Done vs remaining phases; risks/blockers; next safe step.

## Routing

`/install-project` → A. `/rewrite-project` → B. Ambiguous → one clarifying question.
