# Facility Insights Monorepo
This repo includes everything about Facility Insights product and it's development lifecycle. This project has 3 main folders.

- database: Everything related to migrations and management of Postgres database.
- fi-sveltekit: Sveltekit project for fullstack deployment.
- scripts: Scripts we use to manage processes in CI/CD and database automations.

Environment variables:

Database:

DB_URL=

Sveltekit:

DB_URL=\
ORIGIN=\
NODE_ENV=\
GCS_BUCKET=\
JWT_SECRET=\
APS_CLIENT=\
APS_SECRET=\
APS_BUCKET=\
APS_BASE_URL=\
S_ROUNDS=\
ADMIN_KEY=\
GCS_SA=\
PUBLIC_GMAPS_API=

Scripts:

ARTIFACT_REGISTRY_TARGET=

Feel free to reach out to repository admin if you have any questions.

