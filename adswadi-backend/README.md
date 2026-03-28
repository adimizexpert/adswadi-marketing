# Adswadi CMS API

Express + Supabase backend for the Adswadi landing page content and admin operations.

## Supabase setup

1. Create a free project at [https://supabase.com](https://supabase.com).
2. Open **SQL Editor** → **New query**.
3. Copy the SQL from the comment block at the top of `src/db.js` (between the dashed lines) and run it once. This creates tables, seeds plans, site content, services, and the default admin user.
4. In **Project Settings → API**, copy:
   - **Project URL** → `SUPABASE_URL`
   - **service_role** key (secret) → `SUPABASE_SERVICE_ROLE_KEY`  
     Use the **service role** key only on the server; never expose it in the browser.

## Local development

```bash
cp .env.example .env
# Fill in Supabase keys, JWT_SECRET, and FRONTEND_URL (e.g. http://localhost:3000)
npm install
npm run dev
```

The API listens on `PORT` (default **3001**).

## Deploy on Render (free tier)

1. Push this `adswadi-backend` folder to a Git repository.
2. In Render: **New** → **Web Service** → connect the repo.
3. **Root directory**: `adswadi-backend` (if the repo contains both frontend and backend).
4. **Build command**: `npm install`
5. **Start command**: `npm start`
6. **Environment variables** (same as `.env.example`):
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `JWT_SECRET` (long random string)
   - `FRONTEND_URL` (your Next.js URL, e.g. `https://adswadi.vercel.app`)
   - `PORT` is set automatically by Render; you usually do not need to override it.

### IMPORTANT: Render free tier sleep

Render’s free Web Services **spin down after about 15 minutes** of inactivity. First request after sleep can be slow (cold start).

**Keep the service warm:** use a free cron ping (e.g. [cron-job.org](https://cron-job.org)) to call **`GET /api/health`** on your Render URL **every 10 minutes**. Example: `https://your-app.onrender.com/api/health`.

## Admin password

- Default login (from seed SQL): username **`admin`**, password **`adswadi2025`**. **Change this immediately** in production.

### Change password (authenticated)

`POST /api/admin/change-password` with header `Authorization: Bearer <JWT>` and JSON body:

```json
{
  "current_password": "adswadi2025",
  "new_password": "your-new-secure-password"
}
```

## Generate a bcrypt hash for a custom seed

If you insert or replace an admin row manually:

```bash
node -e "const b=require('bcrypt');b.hash('adswadi2025',10).then(console.log)"
```

Paste the printed hash into the `password_hash` column in SQL.

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

CORS allows only `FRONTEND_URL`. For local Next.js use `http://localhost:3000` (or your dev port).
