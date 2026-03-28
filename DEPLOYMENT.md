# Adswadi deployment guide

This repository contains:

- **Frontend:** Next.js 14 (App Router) — deploy on **Vercel**
- **Backend:** Express + Supabase — deploy on **Render**
- **Database:** Supabase (PostgreSQL) — free tier

Follow the steps in order: Supabase → Render (API) → Vercel (site) → connect CORS.

---

## Prerequisites

- GitHub account with this repo pushed
- [Supabase](https://supabase.com) account (free)
- [Render](https://render.com) account (free)
- [Vercel](https://vercel.com) account (free)

---

## 1. Supabase (database and seed data)

1. Create a new project in the [Supabase Dashboard](https://supabase.com/dashboard).
2. Open **SQL Editor** → **New query**.
3. Copy the SQL from the comment block at the top of `adswadi-backend/src/db.js` (between the dashed lines) and run it once.  
   This creates tables, seeds plans, site content, services, and the default admin user.
4. Go to **Project Settings → API** and copy:
   - **Project URL** → used as `SUPABASE_URL`
   - **`service_role` secret** → used as `SUPABASE_SERVICE_ROLE_KEY` (server only; never expose in the browser)

---

## 2. Deploy the backend on Render

1. In [Render](https://dashboard.render.com), click **New +** → **Web Service**.
2. Connect **GitHub** and select the repository **`adimizexpert/adswadi-marketing`**.
3. Configure the service:

   | Setting | Value |
   |---------|--------|
   | **Name** | e.g. `adswadi-api` |
   | **Region** | Choose closest to your users |
   | **Branch** | `main` (or your default branch) |
   | **Root directory** | `adswadi-backend` |
   | **Runtime** | `Node` |
   | **Build command** | `npm install` |
   | **Start command** | `npm start` |
   | **Instance type** | Free (or paid if you need always-on) |

4. Add **Environment variables** (click **Advanced** if needed):

   | Key | Value |
   |-----|--------|
   | `SUPABASE_URL` | From Supabase Project URL |
   | `SUPABASE_SERVICE_ROLE_KEY` | Supabase `service_role` key |
   | `JWT_SECRET` | Long random string (generate locally, e.g. `openssl rand -hex 32`) |
   | `FRONTEND_URL` | Your **Vercel production URL** after first deploy (see §3). For first API deploy you can use a placeholder and update after Vercel is live. Example: `https://adswadi-marketing.vercel.app` |
   | `PORT` | Leave unset — Render sets `PORT` automatically |

5. Create the Web Service and wait for the first deploy. Note your app URL, e.g. `https://adswadi-api.onrender.com`.

6. **Free tier cold starts:** Render free services sleep after ~15 minutes idle. Use a free cron (e.g. [cron-job.org](https://cron-job.org)) to request **`GET https://YOUR-RENDER-URL.onrender.com/api/health`** every **10 minutes** so the API stays warm. This is optional but improves first-load speed.

7. **Smoke test:** Open `https://YOUR-RENDER-URL.onrender.com/api/health` — you should see JSON like `{ "status": "ok", "timestamp": "..." }`.

---

## 3. Deploy the frontend on Vercel

1. Go to [Vercel](https://vercel.com) → **Add New…** → **Project**.
2. **Import** the GitHub repository **`adimizexpert/adswadi-marketing`**.
3. Vercel should detect **Next.js**. Keep defaults unless you use a monorepo layout that needs a different root (this repo’s Next app is at the **repository root**).
4. Add **Environment variables** (Production — and Preview if you want):

   | Name | Value |
   |------|--------|
   | `NEXT_PUBLIC_API_URL` | Your Render API origin **without a trailing slash**, e.g. `https://adswadi-api.onrender.com` |

5. Click **Deploy**.

6. After deploy, copy the **production URL** (e.g. `https://adswadi-marketing.vercel.app`).

7. **Update CORS on Render:** In your Render Web Service → **Environment** → set `FRONTEND_URL` to that exact Vercel URL (including `https://`, no trailing slash) → **Save changes** (Render will redeploy).

---

## 4. Verify end-to-end

1. Open your Vercel URL — the landing page should load; pricing/services should load from the API if `NEXT_PUBLIC_API_URL` is correct.
2. Open `https://YOUR-VERCEL-URL/admin` — login with the seeded admin (see `adswadi-backend/README.md`); ensure `NEXT_PUBLIC_API_URL` matches your Render URL.
3. If the browser blocks requests, check `FRONTEND_URL` on Render matches the Vercel URL exactly.

---

## 5. Environment variable checklist

**Render (`adswadi-backend`)**

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `JWT_SECRET`
- `FRONTEND_URL` → Vercel production URL

**Vercel (Next.js root)**

- `NEXT_PUBLIC_API_URL` → Render API base URL (no `/` at the end)

**Local development**

- Next.js: copy `.env.local.example` to `.env.local` and set `NEXT_PUBLIC_API_URL=http://localhost:3001` (or your local API port).
- Backend: copy `adswadi-backend/.env.example` to `adswadi-backend/.env` and set variables; use `FRONTEND_URL=http://localhost:3000` when testing locally.

---

## 6. Troubleshooting

| Issue | What to check |
|--------|----------------|
| API returns CORS error | `FRONTEND_URL` on Render must match the exact origin you use in the browser (scheme + host, no path). |
| Landing shows fallback/static data | `NEXT_PUBLIC_API_URL` missing or wrong on Vercel; redeploy after changing env. |
| Admin login fails | API URL in `.env` / Vercel; Supabase keys; admin user exists (SQL seed). |
| Slow first API request | Render free tier cold start; use `/api/health` cron ping or upgrade instance. |

---

## 7. Security reminders

- Rotate the default admin password via `/admin` after going live.
- Never commit `.env` or `.env.local`; only `.env.example` files belong in git.
- Use the Supabase **service role** key only on Render, never in `NEXT_PUBLIC_*` variables.

For API route details and local commands, see `adswadi-backend/README.md`.
