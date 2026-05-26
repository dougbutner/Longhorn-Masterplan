# Example env (names only)

Scratchpad for env **names** / safe defaults. **No real secrets.** Copy to gitignored `.env`, secret manager, or CI.

```bash
NODE_ENV=development
APP_NAME=
APP_URL=http://localhost:3000
PORT=3000
LOG_LEVEL=debug
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/DBNAME
SESSION_SECRET=GENERATE_A_LONG_RANDOM_STRING
JWT_SECRET=GENERATE_A_LONG_RANDOM_STRING
OAUTH_CLIENT_ID=
OAUTH_CLIENT_SECRET=
OAUTH_ISSUER_URL=
API_KEY_EXTERNAL_SERVICE=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
S3_BUCKET=
S3_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
SENTRY_DSN=
DATADOG_API_KEY=
```

Copy needed keys → real env UI → delete unused lines → rotate anything ever leaked.
