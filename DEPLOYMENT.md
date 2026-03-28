# Adswadi deployment guide

Stack: **GitHub** → **Vercel** (Next.js) + **Render** (API + Postgres). No third-party BaaS.

## Push this project to GitHub

```bash
git push -u origin main
```

Use GitHub CLI, HTTPS + PAT, or SSH as needed. If the remote already has commits:

```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

---

## What’s in this repo

| Part | Host |
|------|------|
| Next.js app | **Vercel** (repo root) |
| Express API | **Render** Web Service (`adswadi-backend/`) |
| PostgreSQL | **Render Postgres** (or any Postgres; Render keeps everything in one place) |

---

## Prerequisites

- GitHub repo pushed
- [Render](https://render.com) account
- [Vercel](https://vercel.com) account

---

## 1. Create PostgreSQL on Render

1. In [Render Dashboard](https://dashboard.render.com): **New +** → **PostgreSQL**.
2. Choose name, region (same as your API later), instance (free tier if available).
3. After creation, open the database → **Connect** — you will use:
   - **Internal Database URL** — for the Web Service in the **same** region (recommended).
   - **External Database URL** — for local dev or if the API runs elsewhere; often requires SSL.

4. **Initialize schema:** open **Shell** (or use `psql` with the external URL) and run the full contents of **`adswadi-backend/schema.sql`** once. This creates tables and seed data (admin, plans, content, services).

---

## 2. Deploy the API on Render

1. **New +** → **Web Service** → connect **`adimizexpert/adswadi-marketing`** (or your repo).
2. Settings:

   | Setting | Value |
   |---------|--------|
   | **Root directory** | `adswadi-backend` |
   | **Build command** | `npm install` |
   | **Start command** | `npm start` |

3. **Environment variables:**

   | Key | Value |
   |-----|--------|
   | `DATABASE_URL` | Paste **Internal** URL from your Render Postgres, **or** link the database in the Web Service UI so Render injects it. |
   | `DATABASE_SSL` | `true` if you use the **External** URL or your provider requires SSL; for **Internal** Render URL you can omit or set `false`. |
   | `JWT_SECRET` | e.g. `openssl rand -hex 32` |
   | `FRONTEND_URL` | Your Vercel URL (set after step 3), e.g. `https://adswadi-marketing.vercel.app` |

4. Deploy and test: `https://YOUR-SERVICE.onrender.com/api/health` → `{ "status": "ok", ... }`.

5. Optional: cron **GET** `/api/health` every ~10 minutes to reduce cold starts on the free tier.

---

## 3. Deploy the frontend on Vercel

1. **Import** the same GitHub repo.
2. Framework: **Next.js** (root = app).
3. **Environment variable:**

   | Name | Value |
   |------|--------|
   | `NEXT_PUBLIC_API_URL` | `https://YOUR-RENDER-API.onrender.com` (no trailing slash) |

4. Deploy, then copy the production URL.

5. On Render → Web Service → **Environment** → set **`FRONTEND_URL`** to that Vercel URL exactly (`https://...`, no trailing slash) → save (redeploy).

---

## 4. Verify

- Open the Vercel URL — pricing/content should load from the API.
- Open **`/admin`** — log in with seeded user (see `adswadi-backend/README.md`).
- If you see CORS errors, **`FRONTEND_URL`** on Render must match the browser origin.

---

## 5. Environment checklist

**Render Web Service**

- `DATABASE_URL`
- `DATABASE_SSL` (when needed)
- `JWT_SECRET`
- `FRONTEND_URL`

**Vercel**

- `NEXT_PUBLIC_API_URL`

**Local**

- Next: `.env.local` → `NEXT_PUBLIC_API_URL=http://localhost:3001`
- API: `adswadi-backend/.env` from `.env.example`; `FRONTEND_URL=http://localhost:3000`

---

## 6. Troubleshooting

| Issue | Check |
|--------|--------|
| `ECONNREFUSED` / DB errors | `DATABASE_URL`, SSL flags, Postgres running, `schema.sql` applied |
| CORS | `FRONTEND_URL` matches Vercel exactly |
| Site shows defaults | `NEXT_PUBLIC_API_URL` on Vercel; redeploy after changes |
| Admin 401 | Seed ran; JWT_SECRET stable between deploys |

---

## 7. Security

- Change default admin password after launch.
- Never commit `.env` / `.env.local`.
- `JWT_SECRET` stays server-only on Render.

See **`adswadi-backend/README.md`** for API details.
