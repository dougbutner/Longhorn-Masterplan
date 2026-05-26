# Command index

Route intent → load file → run workflow. Operator notes: `Human/HUMAN-README.md`.

| Command | Typical triggers | Instruction |
| --- | --- | --- |
| `/bootstrap-project` | slash; "greenfield"; "empty repo"; "new project" | `Human/bootstrap-project.md` |
| `/install-project` | slash; "install cogo"; "set up cogo for this repo" | `Human/install-project.md` **Workflow A** |
| `/rewrite-project` | slash; "rewrite to [stack]"; "migrate from [a] to [b]" | `Human/install-project.md` **Workflow B** |
| `/handoff` | slash; "handoff"; "next session should know" | `Human/handoff.md` |
| `/review` | slash; "review PR"; "review architecture" | `Human/review.md` |
| `/test-plan` | slash; "what tests" | `Human/test-plan.md` |
| `/release-notes` | slash; "changelog"; "release notes" | `Human/release-notes.md` |

**Natural language (no slash):** prod outage / incident / urgent prod or staging debug → `Human/incident-or-debug.md`.

## Supporting refs

| Need | File |
| --- | --- |
| Confirm before risky ops | `Human/safety-and-confirmations.md` |
| Repo/stack signals | `Human/stack-detection-checklist.md` |
| Migration patterns | `Human/migration-playbook.md` |
| One-shot constraints | `Human/project-constraints-template.md` |
| Env **names** only (copy to real `.env`) | `Human/example-env.md` |
| Bundle history | `Human/CHANGELOG.md` |
