# Project Requirements Document (PRD)

---

## 1. Executive Overview
- **Product Name:** Ranveer Singh Portfolio
- **Subject:** Ranveer Singh (B.Tech 1st Year CE - AI/ML Student)
- **Aesthetic Vibe:** Cinematic, futuristic, luxury, elegant, glassmorphism-centric, inspired by Awwwards portfolio standards like *Aerukart*.
- **Primary Goal:** Display Ranveer Singh's exact resume attributes through a series of rich, buttery-smooth interactive components on a single-page full-range viewport.

---

## 2. Technical Stack
- **Framework:** React.js (v19) powered by Vite.
- **Styling:** Tailwind CSS (v4) with custom premium branding variables.
- **Smoothing & Motion:** Lenis Smooth Scroll, GSAP, and Framer Motion (`motion/react`) for letter-staggers and lightbox fades.
- **Feedback & Interactions:** Custom multi-state LERP-interpolated Dual Core custom cursor.
- **Inbound Communications:** EmailJS client integration with a smart mock-up fallback guard.
- **Icons:** Lucide React icons.

---

## 3. Structural Scope & Files Inventory
The application is structured precisely to maintain optimal modularity and avoid file cutoff:
- `/src/data/portfolioData.ts` - Hosts 100% genuine resume information. Zero fake items.
- `/src/components/BackgroundEffect.tsx` - Canvas particles + dual coordinates mouse spotlights.
- `/src/components/CustomCursor.tsx` - Dual dot tracking cursor with hover triggers and ripples.
- `/src/components/Loader.tsx` - Init load tracking percent meter and title reveal.
- `/src/sections/Hero.tsx` - Full screen grid showcasing portraits and key call-to-actions.
- `/src/sections/About.tsx` - Horizontal split profile reveal.
- `/src/sections/Education.tsx` - Vertical timeline nodes.
- `/src/sections/Experience.tsx` - Engagement grids.
- `/src/sections/Skills.tsx` - Bento capabilities grids.
- `/src/sections/Contact.tsx` - Split visual contact section with EmailJS form validation.
- `/src/components/Footer.tsx` - Top scroll indicator, custom timezone clock, and signature line.
- `/src/components/ResumeModal.tsx` - Elegant fullscreen modal displaying complete printable curriculum vitae.

---

## 4. UI/UX Rules & Color Palette
- **Primary Background:** `#050505` (Solid pure slate-black).
- **Secondary Background:** `#0D0D0D`, `#111111` (Glass panels).
- **Core Typography Hue:** `#F5F5F5` (High-contrast clean silver-white) and `#BFC0C0` (Muted support gray).
- **Accent Highlight:** `#4DA8FF` (Glowing light blue representing AI/ML engineering context).
- **Typography pairing:** **Space Grotesk** for cinematic heading masks, **Inter** for responsive body copy.
- **Anti-AI-Slop constraint:** No decorative mock terminal indicators, pings, ports, or telemetry. Keep layout entirely honest, human, clean, and spacious.

---

## 5. Communications & EmailJS Setup
To receive direct visitor emails, verify the following keys inside your system's project `.env`:
```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```
If these parameters are missing, the contact compiler acts on a simulated mock timer to demonstrate a perfect operational flow.

---

## 6. Deployment (hosting options)

The application builds to a static `dist/` folder. Recommended deployment options:

- **Vercel (recommended)**
	- Connect the repo in Vercel, let it auto-detect Vite.
	- Build command: `npm run build`
	- Output directory: `dist`
	- Add `VITE_EMAILJS_*` environment variables in Project Settings.

- **Netlify**
	- Create a new site and link the repo.
	- Build command: `npm run build`
	- Publish directory: `dist`
	- Add `VITE_EMAILJS_*` env vars under Site settings → Build & deploy → Environment.

- **GitHub Pages (static)**
	- Build locally with `npm run build` which produces `dist/`.
	- Publish using `gh-pages` or a GitHub Action to push `dist/` to `gh-pages` branch.

```bash
npm install --save-dev gh-pages
npx gh-pages -d dist
```

	- If deploying to a repository subpath, set `base` in `vite.config.ts` appropriately or use hash-based routing to avoid 404s.

**CI / Automation**
- A simple GitHub Action can run `npm ci`, `npm run build` and deploy `dist/` to GitHub Pages or invoke a Netlify/Vercel deploy hook.

**Notes**
- Always configure `VITE_EMAILJS_*` env vars for the selected host to enable the contact form.
- Use `npm run preview` locally after build to validate the production bundle before publishing.

---

## 7. Developer Setup

- Prerequisites: Node 18+, npm
- Install dependencies: `npm ci`
- Start dev server (hot reload): `npm run dev` (Vite runs on port 3000 by default)
- Build production bundle: `npm run build`
- Preview production build locally: `npm run preview`
- TypeScript check (no emit): `npm run lint`

Environment variables (examples):
```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

## 8. Implementation Notes

- The app bootstraps `Lenis` after the initial loader completes to provide smooth physics-based scrolling. When the resume modal is open, Lenis is paused to avoid scroll conflicts.
- `BackgroundEffect` draws interactive canvas visuals and should be performance-aware on mobile. Consider capping particle counts on low-DPI devices.
- `ResumeModal` renders a print-friendly resume; ensure CSS `@media print` rules are validated if printable export is required.

## 9. NPM Scripts (from `package.json`)

- `dev`: Run Vite dev server — `vite --port=3000 --host=0.0.0.0`
- `build`: Build production bundle — `vite build`
- `preview`: Preview production build — `vite preview`
- `clean`: Remove `dist` and `server.js` artifacts — `rm -rf dist server.js` (Windows users may prefer a PowerShell equivalent)
- `lint`: TypeScript type-check — `tsc --noEmit`

---

If you want, I can also add a minimal `CONTRIBUTING.md` and a GitHub Action for publishing `dist/` to GitHub Pages or Netlify deploy hooks.
