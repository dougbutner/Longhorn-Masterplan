# Stack detection

Use for install / rewrite / bootstrap inference.

1. Root: lock/manifest (`package.json`, `pnpm-lock.yaml`, `requirements.txt`, `pyproject.toml`, `go.mod`, `Cargo.toml`, `composer.json`, `Gemfile`, `Dockerfile`, `docker-compose`, `Makefile`, `Justfile`).
2. Monorepo: `pnpm-workspace.yaml`, `turbo.json`, `nx.json`, `lerna.json`.
3. FE: `vite/next/nuxt/angular/svelte.config.*`, `index.html`.
4. BE: framework configs (Express/Nest/Django/FastAPI/Rails/Spring…).
5. Mobile: `android/`, `ios/`, Flutter/RN.
6. DB: Prisma/Drizzle/migrations/compose DB services.
7. Auth: OAuth/OIDC/NextAuth/Clerk/Auth0/Cognito/Supabase….
8. CI: `.github/workflows`, GitLab CI, etc.
9. Cloud: Terraform/Pulumi/K8s/serverless/Vercel/Fly/Railway…

**Ambiguous:** Two hypotheses → one question → record decision in `Current-Project.md` → Recent Decisions.
