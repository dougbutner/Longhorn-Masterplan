# Migration playbook (`/rewrite-project`)

**Patterns:** Strangler (new behind boundary); parallel write/read + compare; feature flags; batched data migration + verify counts/checksums.

**Phase end:** Tests green (or documented exceptions); rollback documented (flag/migrate/DNS).

**With:** `safety-and-confirmations.md`; `stack-detection-checklist.md`.
