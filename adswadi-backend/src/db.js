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

const YOUTUBE_PLAN_SEEDS = [
  {
    name: "silver",
    label: "Starter Pack",
    price: 9999,
    badge: null,
    features: JSON.stringify([
      "4 Long Videos / Month",
      "Basic Research & Scripting",
      "Standard Cuts & Subtitles",
      "4 Thumbnail Designs",
      "Email Support",
    ]),
    cta_text: "Start with Silver",
  },
  {
    name: "gold",
    label: "Growth Pack",
    price: 18999,
    badge: "Most Popular",
    features: JSON.stringify([
      "8 Long Videos / Month",
      "Deep Storytelling Scripts",
      "Premium Motion Graphics",
      "8 Thumbnails + A/B Testing",
      "Priority WhatsApp Support",
    ]),
    cta_text: "Choose Gold",
  },
  {
    name: "diamond",
    label: "Diamond Pack",
    price: 29999,
    badge: null,
    features: JSON.stringify([
      "12 Long + 10 Shorts / Month",
      "Viral Hooks + Growth Strategy",
      "Netflix-Style Documentary Editing",
      "Unlimited Thumbnail Revisions",
      "Personal Brand Consultant",
    ]),
    cta_text: "Get Diamond",
  },
];

const INSTAGRAM_PLAN_SEEDS = [
  {
    name: "silver",
    label: "Starter Pack",
    price: 9999,
    badge: null,
    features: JSON.stringify([
      "8 Reels & Carousels / Month",
      "Caption & hashtag research",
      "Stories & highlights scheduling",
      "Grid planning & reporting",
      "Email support",
    ]),
    cta_text: "Start with Silver",
  },
  {
    name: "gold",
    label: "Growth Pack",
    price: 18999,
    badge: "Most Popular",
    features: JSON.stringify([
      "16 Reels + Stories / Month",
      "Trend-led hooks & audio",
      "Community management (DMs)",
      "Monthly performance pack",
      "Priority WhatsApp support",
    ]),
    cta_text: "Choose Gold",
  },
  {
    name: "diamond",
    label: "Diamond Pack",
    price: 29999,
    badge: null,
    features: JSON.stringify([
      "Full feed + Reels pipeline",
      "Influencer & UGC coordination",
      "Campaign bursts & launches",
      "Ads creative handoff",
      "Dedicated strategist",
    ]),
    cta_text: "Get Diamond",
  },
];

/** YouTube vs Instagram pricing rows share tier names but differ by `platform`. */
function migratePlansPlatform() {
  const cols = db.prepare("PRAGMA table_info(plans)").all();
  const hasPlatform = cols.some((c) => c.name === "platform");
  if (!hasPlatform) {
    db.exec(
      "ALTER TABLE plans ADD COLUMN platform TEXT NOT NULL DEFAULT 'youtube'"
    );
  }
  db.exec(
    "CREATE UNIQUE INDEX IF NOT EXISTS idx_plans_name_platform ON plans(name, platform)"
  );

  const total = db.prepare("SELECT COUNT(*) AS c FROM plans").get();
  if (total && total.c === 0) {
    console.warn("[db] plans table empty — seeding YouTube then Instagram tiers");
    insertPlansForPlatform("youtube", YOUTUBE_PLAN_SEEDS);
    insertPlansForPlatform("instagram", INSTAGRAM_PLAN_SEEDS);
    return;
  }

  const igCount = db
    .prepare("SELECT COUNT(*) AS c FROM plans WHERE platform = 'instagram'")
    .get();
  if (igCount && igCount.c === 0) {
    insertPlansForPlatform("instagram", INSTAGRAM_PLAN_SEEDS);
  }
}

function insertPlansForPlatform(platform, seeds) {
  const ins = db.prepare(
    `INSERT INTO plans (name, label, price, badge, features, cta_text, platform, updated_at)
     VALUES (@name, @label, @price, @badge, @features, @cta_text, @platform, datetime('now'))`
  );
  for (const p of seeds) {
    try {
      ins.run({ ...p, platform });
    } catch (e) {
      console.warn(`[db] insert ${platform} ${p.name}:`, e.message);
    }
  }
}

migratePlansPlatform();

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
