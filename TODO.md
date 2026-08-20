# TODO — Fix Contact form (switch from EmailJS to server-side email)

## Plan
- [x] 1. Create `vite-plugin-api.mjs` (local dev middleware for `/api/send-enquiry`)
- [x] 2. Update `vite.config.ts` to load `.env` credentials and register the plugin
- [x] 3. Create `.env` with `GMAIL_USER` and `GMAIL_APP_PASSWORD` (gitignored)
- [x] 4. Update `src/sections/Contact/Contact.tsx` to POST to `/api/send-enquiry` (remove EmailJS)
- [x] 5. Verify local dev server runs and form submits successfully

## Notes
- Root cause of the original error was a broken EmailJS template ID (`5mugabi`) → 400 "template ID not found".
- Switched to a server-side nodemailer (Gmail SMTP) endpoint to avoid the EmailJS dependency entirely.
- Local dev serves `/api/send-enquiry` via `vite-plugin-api.mjs` middleware.
- Production uses `netlify/functions/send-enquiry.mjs` (Netlify) or `api/send-enquiry.ts` (Vercel).
- Gmail credentials are stored in `.env` (gitignored) and read only on the server.
- Verified: `npm run build` passes; API test returned `200 {ok:true}` (email delivered).
