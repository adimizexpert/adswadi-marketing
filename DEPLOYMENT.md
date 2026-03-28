# Adswadi deployment guide

Stack: **GitHub** → **Vercel** (Next.js) + **Render** (Express API only).  
**No separate database bill:** the API uses **SQLite** inside the Web Service (`data/adswadi.db`).

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
| Express API + SQLite file DB | **One** Render **Web Service** (`adswadi-backend/`) |

---

## Prerequisites

- GitHub repo pushed
- [Render](https://render.com) account
- [Vercel](https://vercel.com) account

---

## 1. Deploy the API on Render (Web Service only)

No Postgres, no extra database service.

1. **New +** → **Web Service** → connect your repo (e.g. `adimizexpert/adswadi-marketing`).
2. Settings:

   | Setting | Value |
   |---------|--------|
   | **Root directory** | `adswadi-backend` |
   | **Build command** | `npm install` |
   | **Start command** | `npm start` |

3. **Environment variables:**

   | Key | Value |
   |-----|--------|
   | `JWT_SECRET` | e.g. `openssl rand -hex 32` |
   | `FRONTEND_URL` | Your Vercel URL (set after step 2), e.g. `https://adswadi-marketing.vercel.app` |

   Do **not** need `DATABASE_URL` — the app creates **`data/adswadi.db`** on disk and runs **`schema.sql`** on startup.

4. Deploy and test: `https://YOUR-SERVICE.onrender.com/api/health` → `{ "status": "ok", ... }`.

5. Optional: cron **GET** `/api/health` every ~10 minutes to reduce cold starts on the free tier.

### Free tier: know the tradeoff

Render’s **free** Web Service uses **ephemeral** storage. **Redeploys** (or full instance replacement) can **wipe** `data/adswadi.db`. The API will **re-create** the DB and **seed defaults** — CMS edits since last deploy may be lost. For many landing pages that’s acceptable at **$0**. To keep the DB across deploys on Render, you’d use a **persistent disk** (paid add-on) and set **`SQLITE_PATH`** to that path (see `adswadi-backend/README.md`).

---

## 2. Deploy the frontend on Vercel

1. **Import** the same GitHub repo.
2. Framework: **Next.js** (root = app).
3. **Environment variable:**

   | Name | Value |
   |------|--------|
   | `NEXT_PUBLIC_API_URL` | `https://YOUR-RENDER-API.onrender.com` (no trailing slash) |

4. Deploy, then copy the production URL.

5. On Render → Web Service → **Environment** → set **`FRONTEND_URL`** to that Vercel URL exactly (`https://...`, no trailing slash) → save (redeploy).

---

## 3. Verify

- Open the Vercel URL — pricing/content should load from the API.
- Open **`/admin`** — log in with seeded user (see `adswadi-backend/README.md`).
- If you see CORS errors, **`FRONTEND_URL`** on Render must match the browser origin.

---

## 4. Environment checklist

**Render Web Service**

- `JWT_SECRET`
- `FRONTEND_URL`

**Vercel**

- `NEXT_PUBLIC_API_URL`

**Local**

- Next: `.env.local` → `NEXT_PUBLIC_API_URL=http://localhost:3001`
- API: `adswadi-backend/.env` from `.env.example`; `FRONTEND_URL=http://localhost:3000`

---

## 5. Troubleshooting

| Issue | Check |
|--------|--------|
| API errors on first boot | Build logs; `better-sqlite3` must compile on Render (default Node build usually works) |
| CORS | `FRONTEND_URL` matches Vercel exactly |
| Site shows defaults | `NEXT_PUBLIC_API_URL` on Vercel; redeploy after changes |
| Admin 401 | `JWT_SECRET` stable between deploys; default seed user |
| CMS edits vanished after deploy | Expected on **free** tier ephemeral disk — see §1 |

---

## 6. Security

- Change default admin password after launch.
- Never commit `.env` / `.env.local`.
- `JWT_SECRET` stays server-only on Render.

See **`adswadi-backend/README.md`** for API details.
