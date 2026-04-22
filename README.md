# HIJIR Travel & Tours — Demo System

Vanilla HTML/CSS/JS sales demo for a Malaysian travel agency. Showcases a public website plus an admin dashboard that generates Quotation, Invoice, and Receipt PDFs matching three client-provided sample layouts.

**This is a demo.** All data lives in JavaScript arrays — there is no backend, no database, and no persistence across page reloads.

## Quick Start

This is a pure static site — pure HTML, CSS, and JavaScript, no runtime. You only need **any static HTTP server** to view it locally (because `<script type="module">` imports don't work from `file://` — browser CORS rule).

Pick whichever static server you already have on hand:

- **VS Code Live Server** extension — right-click `index.html` → *Open with Live Server*
- **Node**: `npx serve .`
- **PHP**: `php -S localhost:8000`
- **Python** (if already installed): `python -m http.server 8000`
- **Deploy** to GitHub Pages / Netlify / Hostinger / any shared hosting — drag-drop the folder, done

Then open `http://localhost:<port>` (or your deployed URL).

The entry page (`index.html`) auto-redirects based on viewport width:
- `< 768px` → `mobile/index.html`
- `≥ 768px` → `desktop/index.html`

**The project itself has zero runtime dependencies.** No Python, no Node, no PHP — just a static file host.

## Demo Login

```
Email:    admin@gmail.com
Password: admin123
```

Click the **Login** button on any landing page. Session lives in `sessionStorage` and clears on tab close.

## What's Inside

### Public pages (no login)
- **Home** — hero + packages + gallery teaser
- **About** — company story + mission/vision/values
- **Packages** — full package grid with category filter
- **Gallery** — tour memory photos (lightbox on click)
- **Contact Us** — info + message form (demo toast on submit)

### Admin pages (login required)
- **Dashboard** — 5 stat cards + quick actions + recent activity
- **Clients** — table with per-client action buttons (Quote / Invoice / Receipt / Edit / Delete)
- **Packages** — full CRUD for travel packages
- **Create** (sidebar dropdown) — client-picker modal then form, for fresh document creation
- **Gallery Management** — image grid with demo-only upload toast
- **Site Settings** — edit company info, bank details, landing hero text (in-memory)

### PDF generation
Three forms matching the client's sample layouts:
1. **Quotation** — 7-column travelers table + 4-row yellow summary + Jadual Keempat Terma & Syarat
2. **Invoice** — 5-column line-items table + JUMLAH KESELURUHAN + Terma & Syarat
3. **Receipt** — 4-column products table + Deposit/Baki summary + conditional red **PAID** stamp (only when Baki = 0) + payment method with strikethrough on unselected options

PDFs render via jsPDF 2.5.1 + autotable 3.8.2 (bundled locally in `libs/`).

## File Structure

```
index.html                 entry point (viewport redirect)
libs/                      jsPDF + autotable (local, offline-safe)
assets/                    logo, hero, packages/, gallery/ images
shared/                    data.js, auth.js, router.js, pdf-generator.js
desktop/                   desktop views (sidebar admin layout)
mobile/                    mobile views (bottom-nav layout)
```

Desktop and mobile views share `shared/*.js` for data, auth, and PDF generation — no duplication.

## Adding Real Assets

The demo uses CSS text-placeholder boxes where images would be. To drop in real assets:

- **Logo** — replace `assets/logo.png`
- **Hero background** — replace `assets/hero-bg.jpg`
- **Package images** — add to `assets/packages/` and set the path in admin Packages → Edit
- **Gallery photos** — add to `assets/gallery/` and update `shared/data.js` `GALLERY` array

The HTML placeholders can be swapped for `<img src="...">` tags as needed.

## Demo Caveats

- **No persistence.** Adding/editing clients, packages, or settings resets on page reload. This is intentional for demo.
- **No real email/upload.** Contact form and gallery upload show toasts only.
- **Hardcoded login.** Single admin user in `shared/data.js` USERS.
- **PDF T&C is canned.** The Terma & Syarat pages are reproduced from the client samples as static text in `pdf-generator.js`.

## Tech Notes

- Pure ES modules (`<script type="module">`) — requires serving via HTTP (not `file://`).
- No build step. No npm install. No framework.
- Uses `sessionStorage` for login state so it clears naturally on tab close.
- CSS Grid + Flexbox layout, CSS variables for the HIJIR green brand color (`#0f7a4a`).
