# Ranveer Singh Portfolio

A premium, cinematic portfolio website for Ranveer Singh — a B.Tech CE (AI/ML) student. The site is a single-page React + Vite application showcasing a custom cinematic UI (glassmorphism, custom cursor, animated backgrounds) and a printable resume modal.

## Features
- Smooth, physics-inspired scrolling (Lenis)
- Cinematic entry Loader and animated transitions (motion/react + GSAP)
- Custom dual-dot cursor with hover states
- Interactive background canvas effects
- Resume lightbox modal with printable CV
- Contact form powered by EmailJS (config via environment variables)

## Tech Stack
- React 19 + TypeScript
- Vite (dev server & build)
- Tailwind CSS
- Lenis (smooth scroll), GSAP, motion/react
- EmailJS client for contact form

## Quick Start
Prerequisites: Node 18+ and npm.

Install dependencies:
```bash
npm ci
```

Run development server (hot reload):
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Preview production build locally:
```bash
npm run preview
```

Run TypeScript check:
```bash
npm run lint
```

## Environment Variables
Create a `.env` (or set environment vars in your host) with the following keys to enable EmailJS contact delivery:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

If these are not provided, the contact component falls back to a simulated mock response for demo purposes.

## Project Structure (key files)
- `src/App.tsx` — App shell, Lenis init, scroll progress and modal state
- `src/data/portfolioData.ts` — Personal information, education, experience, skills, social links
- `src/sections/*` — Page sections (Hero, About, Experience, Skills, Contact)
- `src/components/*` — UI primitives: `BackgroundEffect`, `CustomCursor`, `Loader`, `Footer`, `ResumeModal`

## Deployment
Recommended hosts: Vercel or Netlify. Build output is placed in `dist/`.

- Vercel: connect repo, set build command `npm run build`, output `dist`, add `VITE_EMAILJS_*` env vars in project settings.
- Netlify: set build command `npm run build`, publish directory `dist`, add env vars in Site settings.
- GitHub Pages: build locally and publish `dist/` using `gh-pages` or a GitHub Action.

## Contact
- Author: Ranveer Singh — singhranveer81365@gmail.com

---
Small contributions and corrections welcome. Open an issue or PR with suggested improvements.
# Ranveer Singh — Portfolio (Vite + React + TypeScript)

A modern, cinematic portfolio site built with Vite, React and Tailwind CSS. It showcases Ranveer Singh’s academic profile, experience, skills and contact form with smooth inertia scrolling, animated visuals and a resume drawer.

---

**Highlights**
- **Interactive hero** with animated name reveal and avatar.
- **Smooth scroll** powered by `lenis` and scroll progress indicator.
- **Ambient canvas** background effects and a custom cursor.
- **Resume drawer** and contact form (EmailJS integration configurable via env).

---

**Tech Stack**
- **Framework:** React 19 + TypeScript
- **Build:** Vite
- **Styling:** Tailwind CSS
- **Animation:** motion/react (Framer Motion) + GSAP
- **Utilities:** Lenis (smooth scroll), EmailJS (contact)

---

**Quick Start**

Requirements: Node.js (16+ recommended).

1) Install dependencies

```bash
npm install
```

2) Run development server (local)

```bash
npm run dev
```

3) Build for production

```bash
npm run build

# Preview production build
npm run preview
```

Other scripts from `package.json`:
- `clean`: removes `dist` and `server.js`
- `lint`: runs TypeScript checker (`tsc --noEmit`)

---

**Environment**
Create a `.env` (or `.env.local`) with EmailJS keys to enable the contact form:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

If env vars are not provided the form uses a fallback/mock behavior.

---

**Project Structure (key files)**
- [src/App.tsx](src/App.tsx): Application shell and smooth-scroll initialization.
- [src/main.tsx](src/main.tsx): React entry.
- [src/data/portfolioData.ts](src/data/portfolioData.ts): Personal info, education, experience and social links.
- [src/sections/Hero.tsx](src/sections/Hero.tsx): Hero section with CTA buttons and avatar.
- [src/components/BackgroundEffect.tsx](src/components/BackgroundEffect.tsx): Canvas particle visuals.
- [src/components/CustomCursor.tsx](src/components/CustomCursor.tsx): Custom cursor behavior.
- [src/components/ResumeModal.tsx](src/components/ResumeModal.tsx): Resume drawer component.

---

**Personal Details (from data/portfolioData.ts)**
- **Name:** Ranveer Singh
- **Role:** B.Tech 1st Year CE (AI/ML) Student
- **Location:** Meghaninagar Ahmedabad
- **Email:** singhranveer81365@gmail.com

---

**Notes & Next Steps**
- To publish, run `npm run build` and serve the `dist` output.
- Add real EmailJS credentials to enable live contact messages.
- If you'd like, I can also add a short deployment guide (GitHub Pages / Netlify / Vercel).

---

Made with care — tweak copy in [src/data/portfolioData.ts](src/data/portfolioData.ts) to update personal content.

---

**Deployment**

Below are quick deployment options for the built `dist` output.

- Vercel (recommended)
	- Connect the Git repository in the Vercel dashboard.
	- Set Framework Preset to `Vite` (Vercel usually detects it automatically).
	- Build command: `npm run build`
	- Output directory: `dist`
	- Add environment variables in the Vercel project settings (`VITE_EMAILJS_*`) to enable the contact form.

- Netlify
	- Create a new site from Git and point to the repository.
	- Build command: `npm run build`
	- Publish directory: `dist`
	- Add the `VITE_EMAILJS_*` env vars under Site settings → Build & deploy → Environment.

- GitHub Pages (static)
	- Build locally: `npm run build` produces `dist/`.
	- Option A (recommended for SPA): use `gh-pages` to publish `dist/` to the `gh-pages` branch:

```bash
npm install --save-dev gh-pages
npx gh-pages -d dist
```

	- Option B: create a GitHub Action to build and deploy `dist/` to `gh-pages` automatically.
	- Note: If using client-side routing, either configure `vite.config.ts` `base` option or use hash-based routing to avoid 404s.

**Notes**
- Ensure env vars (EmailJS keys) are set in the chosen hosting provider to allow the contact form to send messages.
- For simple previews you can run `npm run preview` after `npm run build` to test the production bundle locally.

If you want, I can add a ready-to-use GitHub Action or a `deploy` npm script that runs `gh-pages` for you.

