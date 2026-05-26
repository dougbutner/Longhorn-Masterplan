# Safety

**Confirm before:** Destructive git/file/DB ops; prod/staging migrations without backup+target; prod secret rotation; authz/billing/PII changes without requirement; legal/compliance/security posture (CORS/CSP/crypto/retention).

**Usually confirm:** Heavy native deps; broad unrelated refactors; disabling tests/lint/types to pass.

**Secrets:** No real secrets in chat unless human explicitly accepts risk. `example-env.md` = names/docs only; real values → gitignored `.env` or secret manager/CI.

**Unsure:** One clarifying question → smallest safe step.
