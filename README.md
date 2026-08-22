# Shiv Enterprises — Machinery Edition

Industrial machinery storefront with a shared Cloudflare D1 inventory, secure admin console, and server-side enquiry email delivery through Resend.

## Local development

```bash
npm install
npm run dev
```

The public site is available at `/`; the administrator is at `/admin`. Local development uses an in-memory server store when a D1 binding is unavailable. Existing browser-backed data is retained as a local cache and is not deleted.

## Production build

```bash
npm run db:generate
npm run build
```

The Cloudflare-compatible Worker entry is `dist/server/index.mjs`. Generated D1 migrations are in `drizzle/` and are copied to `dist/.openai/drizzle/` for Sites hosting.

## Required production services

- Cloudflare Worker: runs the application and server actions.
- Cloudflare D1 binding named `DB`: stores machines, availability, site settings, and enquiries.
- Resend: sends enquiry notifications. No separate mail server is required.
- Encrypted runtime secrets: `ADMIN_PASSWORD`, `SESSION_SECRET`, and `RESEND_API_KEY`.
- Runtime values: `CONTACT_FROM_EMAIL` and `CONTACT_TO_EMAILS`.

Choose one fixed admin password of at least 12 characters and store it directly as the encrypted `ADMIN_PASSWORD` server secret. Use a separate random value of at least 32 characters for `SESSION_SECRET`. Neither value belongs in browser code or source control.

## Environment values

See `.env.example`. Never prefix server secrets with `VITE_`, never commit `.env.local`, and never expose the Resend API key in browser code.

The Resend sender must use the exact domain or subdomain verified in Resend, for example:

```text
CONTACT_FROM_EMAIL=Shiv Enterprises <enquiries@mail.yourdomain.com>
CONTACT_TO_EMAILS=infor.shiventerprise26@gmail.com,anil04172@gmail.com
```

## Data behavior

Admin saves are written to D1 before the interface confirms success. The current admin session updates immediately; other open public tabs refresh on focus and every 12 seconds. New visitors receive the saved state immediately. Enquiries are stored in D1 before email is attempted, so an email-provider outage does not discard a buyer request.
