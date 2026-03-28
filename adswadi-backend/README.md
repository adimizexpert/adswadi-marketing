# Adswadi CMS API

Express + **SQLite** (`better-sqlite3`) — one database file, **no paid Postgres**. Fits a single **Render Web Service** (or any Node host).

## How the DB works

- **File:** `data/adswadi.db` (created automatically next to the app).
- **Schema:** `schema.sql` runs **on startup** (creates tables + seeds if missing).
- **Override path:** set **`SQLITE_PATH`** to an absolute path (optional).

## Local development

```bash
cp .env.example .env
# Set JWT_SECRET, FRONTEND_URL (e.g. http://localhost:3000)
npm install
npm run dev
```

The API listens on `PORT` (default **3001**). The SQLite file appears under `adswadi-backend/data/`.

## Deploy on Render (Web Service only)

1. **New** → **Web Service** → connect your Git repo.
2. **Root directory:** `adswadi-backend`
3. **Build:** `npm install` · **Start:** `npm start`
4. **Environment variables:**

   | Variable | Notes |
   |----------|--------|
   | `JWT_SECRET` | Long random string |
   | `FRONTEND_URL` | Your Vercel site URL, e.g. `https://your-app.vercel.app` |

5. `PORT` is set by Render automatically.

**Free tier caveat:** Render’s free Web Service disk is **ephemeral**. On **redeploy** or **sleep cycles**, the container filesystem can reset and **`data/adswadi.db` may be lost** — the app will re-seed defaults. For a small marketing site that rarely redeploys, that’s often acceptable at **$0**. If you need persistence on Render, use a **persistent disk** (paid add-on) and set **`SQLITE_PATH`** to a path on that volume.

### Free tier sleep

Free Web Services sleep after ~15 minutes idle. Ping **`GET /api/health`** on a cron (e.g. every 10 minutes) if you want fewer cold starts.

## Admin password

Default (from seed): **`admin`** / **`adswadi2025`** — change in production.

### Change password (authenticated)

`POST /api/admin/change-password` with `Authorization: Bearer <JWT>`:

```json
{
  "current_password": "adswadi2025",
  "new_password": "your-new-secure-password"
}
```

## Bcrypt hash for manual SQL

```bash
node -e "const b=require('bcrypt');b.hash('adswadi2025',10).then(console.log)"
```

## API summary

| Method | Path | Auth |
|--------|------|------|
| POST | `/api/login` | No |
| GET | `/api/plans` | No |
| GET | `/api/content` | No |
| GET | `/api/services` | No |
| GET | `/api/health` | No |
| PATCH | `/api/plans/:id` | JWT |
| PATCH | `/api/content/:key` | JWT |
| PATCH | `/api/services/:id` | JWT |
| POST | `/api/admin/change-password` | JWT |

CORS allows only `FRONTEND_URL`. Local Next.js: `http://localhost:3000`.
