# Human commands

**Routing table:** `Human/command-index.md` (commands + triggers + supporting refs).

## How COGO runs a command

1. Match intent (slash or paraphrase—see index).
2. If destructive, prod-impacting, or secrets: `Human/safety-and-confirmations.md` first.
3. Load the instruction file; execute its workflow; ask only for missing required inputs.

## Human notes

- Short explicit prompts; constraints in `Human/project-constraints-template.md` or `Current-Project.md`.
- Rewrites: target stack must be stated.
