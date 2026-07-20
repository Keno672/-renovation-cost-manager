# Renovation Ledger

A mobile-first renovation cost manager for a single home project. Version 1 tracks the full schedule of works, estimates, quotes, actual spend, suppliers, status and priority without requiring an account or backend.

## Features

- Dashboard with live estimate, quote, spend, remaining-cost and progress totals
- Full preloaded renovation schedule grouped into 12 trade sections
- Add, edit, delete and move work items between trades
- Search and filter by trade, status and priority
- Automatic material, labour, other and projected cost calculations
- Dedicated trade, quote and budget views
- One-tap completion and paid status updates
- Local browser persistence
- Validated JSON backup import/export and printable CSV export
- Responsive cards and touch-sized controls on phones

## Run locally

Requires Node.js 20 or later.

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite. Production checks:

```bash
npm run lint
npm run build
npm run preview
```

## Local data

Project data is stored as JSON in the browser's `localStorage` under `renovation-ledger-project-v1`. It stays on that browser and device. Clearing site storage will remove changes, so use **Settings → JSON backup** regularly. Import validates the expected Version 1 structure before replacing current data.

The UI calls a small storage module rather than browser APIs directly, making it straightforward to replace local persistence with a Supabase repository in Version 2.

## Deploy to Vercel

1. Import the GitHub repository into Vercel.
2. Keep the detected framework preset as **Vite**.
3. Use `npm run build` as the build command and `dist` as the output directory.
4. Deploy. No environment variables are required for Version 1.

`vercel.json` includes an SPA rewrite so direct navigation continues to serve the application.

## Version 2 direction

Version 2 can add Supabase-backed multi-device sync and authentication, richer supplier and quote records, and optional document or photo attachments. Those concerns are intentionally excluded from Version 1 so the core schedule and cost workflow remains quick and dependable.
