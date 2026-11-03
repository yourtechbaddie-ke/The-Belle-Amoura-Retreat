# The Belle Amoura Retreat

Repository for The Belle Amoura Retreat's brand assets, portal interfaces and backend migration work.

## Deployment direction

- **Public website:** built in Google AI Studio and intended for Google Cloud Run deployment. The website source is maintained in its own Google AI Studio workflow; this repository is no longer a Vercel website project.
- **Backend:** intended to run as a Google Cloud Run service. The files under `backend/legacy-hatchable/` are preserved reference handlers from the previous Hatchable integration. They are **not Cloud Run-ready**: they import the Hatchable SDK and must be adapted to the chosen Cloud Run runtime, database client, authentication and authorization model before deployment.
- **Database migrations:** `backend/migrations/` preserves the existing travel inquiry and investor lead table definitions for review and migration to the selected managed database.
- **Portals:** `portals/` preserves the portal interface work. Admin, Consultant, Investor, Partner and other portal experiences remain works in progress; they are not connected to live records or production authentication yet.

## Cloud Run integration principles

1. Keep database credentials and privileged keys on the server, never in browser code.
2. Authenticate every portal user and enforce role- and record-level authorization on the backend.
3. Admin access and consultant access must be distinct; consultants should only see records assigned to them.
4. Treat the existing Hatchable handlers as migration references, not production endpoints.
5. Connect the website and portals to a documented Cloud Run API contract once the database and identity provider are selected.

## Source layout

- `backend/legacy-hatchable/` — preserved legacy API handlers requiring adaptation.
- `backend/migrations/` — preserved SQL schema migrations.
- `portals/` — existing portal interfaces and brand assets.
- `content/` — creative direction and content references.

## Locked Amour Privé master palette

- Obsidian: `#07090A`
- Peacock Teal: `#0B4F4A`
- Deep Peacock: `#063B3D`
- Antique Grass: `#68704A`
- Deep Antique Grass: `#4F5737`
- Pearl: `#E9E1D5`

The same master palette applies to the official website and every portal. Portal layouts and role-specific experiences remain distinct.
