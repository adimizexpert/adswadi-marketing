/**
 * SQLite file database — no external Postgres. One Render Web Service is enough.
 *
 * Env: SQLITE_PATH (optional) — absolute path to the .db file.
 * Default: adswadi-backend/data/adswadi.db
 *
 * On Render free tier, disk is ephemeral: DB may reset on redeploy. See DEPLOYMENT.md.
 */

const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");
require("dotenv").config();

const dataDir = path.join(__dirname, "..", "data");
const defaultDbPath = path.join(dataDir, "adswadi.db");
const dbPath = process.env.SQLITE_PATH || defaultDbPath;

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

const schemaPath = path.join(__dirname, "..", "schema.sql");
if (fs.existsSync(schemaPath)) {
  const schema = fs.readFileSync(schemaPath, "utf8");
  db.exec(schema);
} else {
  console.warn("[db] schema.sql not found — tables may be missing.");
}

/**
 * PG-style $1, $2 → SQLite ? placeholders; strips ::jsonb.
 * @param {string} text
 * @param {unknown[]} [params]
 */
async function query(text, params = []) {
  const sql = String(text)
    .replace(/::jsonb/gi, "")
    .replace(/\$(\d+)/g, "?");
  const trimmed = sql.trim();
  const hasReturning = /RETURNING/i.test(sql);

  if (/^\s*SELECT/i.test(trimmed)) {
    const stmt = db.prepare(sql);
    const rows = stmt.all(...params);
    return { rows };
  }

  if (hasReturning) {
    const stmt = db.prepare(sql);
    const rows = stmt.all(...params);
    return { rows };
  }

  const stmt = db.prepare(sql);
  const info = stmt.run(...params);
  return { rows: [], rowCount: info.changes };
}

module.exports = { db, query };
