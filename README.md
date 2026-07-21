# Renovation Ledger

A mobile-first, shared renovation cost manager. Authorised users see and edit the same schedule, estimates, quotes, actual spend, suppliers, statuses and totals from any device.

## Features

- Shared Supabase project with automatic saving and realtime updates
- Email/password access for authorised project members
- Row-level security: only authenticated users can read or edit project data
- Dashboard with live estimate, quote, spend, remaining-cost and progress totals
- Full preloaded renovation schedule grouped into 12 trade sections
- Add, edit, delete and move work items between trades
- Search and filter by trade, status and priority
- Automatic material, labour, other and projected cost calculations
- Dedicated trade, quote and budget views
- Validated JSON backup import/export and printable CSV export
- Responsive cards and touch-sized controls on phones

## Supabase setup

### 1. Create the database

Create a Supabase project, open its **SQL Editor**, and run:

[`supabase/migrations/202607210001_shared_project.sql`](supabase/migrations/202607210001_shared_project.sql)

The migration creates the shared `renovation_projects` table, update metadata, authenticated-user policies and realtime publication. The first authorised sign-in automatically inserts the preloaded renovation schedule if the table is empty.

If you use the Supabase CLI, link the project and run:

```bash
supabase db push
```

### 2. Create authorised users

In Supabase, open **Authentication → Users** and create an account for each person who may access the project. This app intentionally has no public sign-up form.

For a private project, disable public user registration in the Supabase Authentication settings. The login screen then accepts only accounts created by the project owner or administrator.

### 3. Configure the app

Copy the environment template:

```bash
cp .env.example .env.local
```

Fill in the values from **Supabase → Project Settings → API**:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-or-publishable-key
```

The publishable/anon key is designed for browser use. Database access is protected by the migration's row-level security policies. Never put the Supabase service-role key in this application.

## Run locally

Requires Node.js 20 or later.

```bash
npm install
npm run dev
```

Production checks:

```bash
npm run lint
npm run build
npm run preview
```

## How synchronisation works

- The latest shared project is loaded from Supabase after authentication.
- Edits update the interface immediately and save automatically after a short debounce.
- The navigation displays **Saving…**, **All changes saved**, or **Not saved**.
- Supabase Realtime sends changes from other signed-in devices to the open app.
- JSON import replaces the shared project for every authorised user; JSON and CSV export remain local downloads.

The persistence code is isolated in `src/lib/projectRepository.ts`; UI components do not access Supabase directly.

## Deploy to Vercel

1. Import the GitHub repository into Vercel.
2. Keep the detected framework preset as **Vite**.
3. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the Vercel project's environment variables.
4. Use `npm run build` as the build command and `dist` as the output directory.
5. Deploy.

`vercel.json` includes an SPA rewrite so direct navigation continues to serve the application.

## Backups

Use **Settings → JSON backup** before large edits or imports. Supabase is now the system of record; clearing browser storage does not delete the shared project.
