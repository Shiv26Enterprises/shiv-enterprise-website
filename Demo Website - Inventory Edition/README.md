# Northline Machinery Exchange

A local-first industrial machinery storefront with one flat inventory, responsive public pages, enquiry capture and secure administration.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (the default is `http://localhost:8080`).

## Production build

```bash
npm run build
npm start
```

The production server entry is `dist/server/index.mjs` and respects the hosting provider's `PORT` environment variable. For local `npm start` testing, the start script loads `.env.local` automatically when that file exists; deployed environment variables still take precedence.

## Hostinger deployment

Use **Websites → Add website → Node.js Web App** on a Hostinger Business or Cloud plan. Import the GitHub repository or upload a ZIP, then set:

- Node.js: `22.x`
- Build command: `npm run build`
- Output directory: `dist`
- Entry file: `dist/server/index.mjs`
- Start command, when requested: `npm start`

Add `ADMIN_PASSWORD_HASH`, `SESSION_SECRET`, and `NODE_ENV=production` as server environment variables in hPanel before deployment. Never expose either secret with a `VITE_` prefix.

## Local data

Inventory, company settings, enquiries, and uploaded images are stored in the current browser. Administrator access is verified on the server using `ADMIN_PASSWORD_HASH` and an HTTP-only session cookie signed with `SESSION_SECRET`. Each browser signs in with the same fixed password. Clear browser storage or use the reset control in Admin → Site settings to restore seeded demo data.

For public deployment, replace browser storage and local authentication with a server-side database, object storage, and managed identity service.
