# Portfolio Admin API

This is a separate Node.js API service for the existing React + Vite portfolio. It does not replace or migrate the public website.

## Requirements

- Node.js 20 or newer
- A PostgreSQL database
- A long, random session secret
- HTTPS in production

## Local setup

1. Create a PostgreSQL database with your provider.
2. Copy `.env.example` to `.env` in this directory and set the real values. Never commit `.env`.
3. Install dependencies from this directory:

   ```sh
   npm install
   ```

4. Apply the schema from the repository root (or use your database provider's SQL editor):

   ```sh
   psql "$DATABASE_URL" -f server/db/schema.sql
   ```

5. Add `ADMIN_PASSWORD` to the server environment and create the first admin:

   ```sh
   npm run create-admin
   ```

   The bootstrap command hashes the password and will not overwrite an existing account. Remove `ADMIN_PASSWORD` from the environment after bootstrapping.

6. Start the API:

   ```sh
   npm run dev
   ```

   The default port is 4000. Test `GET http://localhost:4000/api/health`.

## Endpoints

Public read-only endpoints:
- `GET /api/health`
- `GET /api/public/projects`
- `GET /api/public/experiences`
- `GET /api/public/skills`

Session authentication:
- `POST /api/auth/login` with JSON `{"email":"...","password":"..."}`
- `GET /api/auth/me`
- `POST /api/auth/logout`

Authenticated admin endpoints:
- `GET, POST /api/admin/projects`; `PATCH, DELETE /api/admin/projects/:id`
- `GET, POST /api/admin/experiences`; `PATCH, DELETE /api/admin/experiences/:id`
- `GET, POST /api/admin/skills`; `PATCH, DELETE /api/admin/skills/:id`
- `GET /api/admin/messages`; `PATCH /api/admin/messages/:id`
- `GET /api/admin/settings`; `PUT /api/admin/settings/:key`

Admin endpoints require the session established by login. CRUD uses parameterised SQL and schema validation. Public endpoints return only published content.

## Deployment notes

Deploy the `server/` directory as a standalone Node service. Set its root directory to `server`, install with `npm install` and run `npm start`. Configure `DATABASE_URL`, `SESSION_SECRET`, `CLIENT_ORIGIN`, `NODE_ENV=production` and `PORT` in the host dashboard.

If the website and API are on different sites, set `COOKIE_SAME_SITE=none` (requires HTTPS). When they are on the same site, prefer the default `lax` setting. Set `CLIENT_ORIGIN` to the exact trusted frontend origin or comma-separated origins.

The React dashboard has not yet been wired to these endpoints. Public portfolio sections also remain on their current static data until the database integration step.
