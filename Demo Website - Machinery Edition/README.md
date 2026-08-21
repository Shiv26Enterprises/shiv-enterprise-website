# Ironclad Machinery Edition

A Hostinger-ready industrial machinery storefront with the original graphite-and-safety-orange theme and a deliberately flat public structure: Home, Inventory, About, and Contact.

## Local development

```bash
npm install
npm run dev
```

The administrator is available at `/admin`. Authentication uses a fixed password hash on the server and an HTTP-only signed session cookie; no plaintext password is shipped to the browser bundle.

## Build and run

```bash
npm run build
npm start
```

The production entry is `dist/server/index.mjs`. `npm start` respects the provider's `PORT` variable and loads `.env.local` for local production testing.

## Hostinger setup

Create a Node.js Web App on a Business or Cloud plan, upload this folder or connect its Git repository, and use:

- Node.js: `22.x`
- Build command: `npm run build`
- Output directory: `dist`
- Start command: `npm start`
- Entry file, if requested: `dist/server/index.mjs`

Add `ADMIN_PASSWORD_HASH`, `SESSION_SECRET`, and `NODE_ENV=production` as server environment variables in hPanel. Never prefix secrets with `VITE_`, and never commit `.env.local`.

## Connecting shared data

Inventory, settings, enquiries, and uploaded images currently use the browser-backed provider in `src/lib/store.tsx`. Public pages and Admin share that API, so a later database connection stays localized: replace the provider's persistence with calls to your API, Supabase, or another database while keeping its exposed actions and data types.

Browser storage is per device. For a live multi-user website where admin edits update every visitor, connect a server database and object storage before launch.
