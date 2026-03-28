/**
 * PostgreSQL connection pool (Render Postgres, local Postgres, Docker, etc.).
 *
 * Run schema once: `adswadi-backend/schema.sql` via Render Shell / psql.
 *
 * Env: DATABASE_URL=postgresql://user:pass@host:5432/dbname
 * Render: Internal URL for same-region services, or External URL from your machine.
 * SSL: set DATABASE_SSL=true if your provider requires SSL (Render external connections).
 */

const { Pool } = require("pg");
require("dotenv").config();

function poolConfig() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.warn("[db] DATABASE_URL is not set.");
    return {};
  }
  const needsSsl =
    process.env.DATABASE_SSL === "true" ||
    url.includes("render.com") ||
    url.includes("sslmode=require");
  return {
    connectionString: url,
    max: 10,
    idleTimeoutMillis: 30_000,
    ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
  };
}

const pool = new Pool(poolConfig());

pool.on("error", (err) => {
  console.error("[db] Unexpected pool error", err);
});

/**
 * @param {string} text
 * @param {unknown[]} [params]
 */
async function query(text, params) {
  const res = await pool.query(text, params);
  return res;
}

module.exports = { pool, query };
