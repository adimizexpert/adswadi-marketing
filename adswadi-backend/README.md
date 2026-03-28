# Adswadi CMS API

Express + **PostgreSQL** (`pg`) for the Adswadi landing page and admin CMS.  
Database: **Render Postgres** (recommended with Render hosting) or any Postgres 14+.

## Database setup

1. Create a PostgreSQL database (e.g. [Render Postgres](https://render.com/docs/databases-postgresql) in the same region as your API).
2. Run the SQL in **`schema.sql`** once:
   - **Render:** open your Postgres → **Connect** → use **Shell** or **psql** with the **External** connection string, then paste/run `schema.sql`, **or**
   - Copy `schema.sql` into the SQL console your provider gives you.
3. Note **`DATABASE_URL`** (connection string). On Render, link the DB to your Web Service so `DATABASE_URL` is injected automatically, or paste it manually under Environment.

## Local development

```bash
cp .env.example .env
# Set DATABASE_URL, JWT_SECRET, FRONTEND_URL (e.g. http://localhost:3000)
# DATABASE_SSL=true if your DB requires SSL
npm install
npm run dev
```

The API listens on `PORT` (default **3001**).

## Deploy on Render (Web Service)

1. **New** → **Web Service** → connect your Git repo.
2. **Root directory:** `adswadi-backend`
3. **Build:** `npm install` · **Start:** `npm start`
4. **Environment variables:**

   | Variable | Notes |
   |----------|--------|
   | `DATABASE_URL` | From Render Postgres (use **Internal** URL if API and DB are both on Render in the same region) |
   | `DATABASE_SSL` | `true` when using Render’s **External** URL or any host that requires SSL |
   | `JWT_SECRET` | Long random string |
   | `FRONTEND_URL` | Your Vercel site URL, e.g. `https://your-app.vercel.app` |

5. `PORT` is set by Render automatically.

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
