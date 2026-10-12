# Portfolio Admin Panel — Implementation Plan

## Goal
Add a secure admin dashboard for the existing Ranveer Singh portfolio without replacing the React + Vite frontend.

## Current stack (confirmed from package.json)
- React 19 + TypeScript + Vite
- Tailwind CSS 4
- Express is already installed, but there is no dedicated backend or database integration in the visible source tree
- EmailJS for contact form
- Motion, GSAP and Lenis for UI/scroll animation

## Proposed architecture
- Existing Vite portfolio remains the public frontend.
- Add a dedicated Node.js + Express API (suggested location: `server/`).
- Use PostgreSQL through `DATABASE_URL` and a server-side database client (recommend `pg`).
- Admin UI under `/admin`, protected by server-side authentication and secure session cookies.
- Deploy frontend and API together on a Node-friendly host, or configure a separate API host and `VITE_API_BASE_URL`.

## Initial database entities
- `admins`: hashed password, email, timestamps. Never store plaintext passwords.
- `projects`: title, slug, summary, description, tech stack, live URL, repository URL, image URL, featured flag, sort order, visibility, timestamps.
- `experiences`: organisation, role, period, description, sort order, visibility, timestamps.
- `skills`: name, category, sort order, visibility.
- `messages`: contact form submissions with read/archive state (avoid storing data that is not needed).
- `site_settings`: optional editable profile/hero/contact fields.
- Add schema migrations and parameterised SQL queries.

## Phased delivery
1. Database schema and server structure.
2. Authentication and session protection.
3. CRUD APIs for projects, experience and skills.
4. Admin dashboard UI.
5. Connect public portfolio sections to the API with static fallback during migration.
6. Configure production environment variables and deployment.
7. Run build/type checks and security review.

## Secrets
- Put `DATABASE_URL` and session secrets only in server environment variables.
- Do not prefix database secrets with `VITE_`.
- Keep `.env` ignored by Git; commit `.env.example` with placeholders only.
- Do not expose admin authentication credentials or privileged connection strings in frontend bundles.

## Non-goals for the first iteration
- No Next.js migration.
- No destructive replacement of current homepage.
- No broad redesign of existing portfolio sections before the admin API works.
