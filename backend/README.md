# Backend migration notes

The handlers in `legacy-hatchable/api/` are retained to preserve validation, SQL statements and existing request/response behaviour during the move away from Vercel/Hatchable.

They are not directly deployable to Google Cloud Run. In particular:

- They import `db` and `admin` from the Hatchable package.
- Their exported `access` metadata relies on the old hosting platform.
- The list endpoints rely on platform-managed admin authentication.
- The current investor email validation expression should be reviewed during the rewrite.

Before deployment, implement a Cloud Run service using the selected runtime and database provider. Add explicit authentication middleware, role checks, consultant-to-record assignment checks, request validation, rate limiting, audit logging and safe error handling. Never expose database credentials or service-account secrets to portal JavaScript.

## Preserved schema

- `migrations/001_travel_inquiries.sql`
- `migrations/002_investor_leads.sql`

These are starting points, not a complete production schema. The portal roadmap will likely require users/roles, consultant assignments, booking records, CRM profiles, status history, commission ledger and audit events. Design those additions before enabling live portal actions.
