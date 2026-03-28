const express = require("express");
const bcrypt = require("bcrypt");
const { query } = require("../db");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

router.get("/plans", async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT * FROM plans ORDER BY price ASC`
    );
    return res.json(rows || []);
  } catch (err) {
    return next(err);
  }
});

router.get("/content", async (req, res, next) => {
  try {
    const { rows } = await query(`SELECT key, value FROM site_content`);
    const out = {};
    for (const row of rows || []) {
      out[row.key] = row.value;
    }
    return res.json(out);
  } catch (err) {
    return next(err);
  }
});

router.get("/services", async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT * FROM services ORDER BY sort_order ASC`
    );
    return res.json(rows || []);
  } catch (err) {
    return next(err);
  }
});

router.patch("/plans/:id", authMiddleware, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid plan id" });
    }

    const allowed = ["price", "label", "badge", "features", "cta_text"];
    const body = req.body || {};
    const patch = {};

    for (const key of allowed) {
      if (
        Object.prototype.hasOwnProperty.call(body, key) &&
        body[key] !== undefined
      ) {
        patch[key] = body[key];
      }
    }

    if (Object.keys(patch).length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    if (patch.features !== undefined && !Array.isArray(patch.features)) {
      return res.status(400).json({ error: "features must be an array" });
    }

    if (Object.prototype.hasOwnProperty.call(body, "price")) {
      const p = parseInt(patch.price, 10);
      if (Number.isNaN(p)) {
        return res.status(400).json({ error: "price must be a number" });
      }
      patch.price = p;
    }

    if (Object.prototype.hasOwnProperty.call(body, "badge")) {
      patch.badge = body.badge === "" || body.badge === null ? null : body.badge;
    }

    patch.updated_at = new Date().toISOString();

    const keys = Object.keys(patch);
    const values = keys.map((k) =>
      k === "features" ? JSON.stringify(patch[k]) : patch[k]
    );
    const setParts = keys.map((k, i) =>
      k === "features" ? `features = $${i + 1}::jsonb` : `${k} = $${i + 1}`
    );
    const idParam = keys.length + 1;
    const sql = `UPDATE plans SET ${setParts.join(", ")} WHERE id = $${idParam} RETURNING *`;
    const { rows } = await query(sql, [...values, id]);

    const row = rows[0];
    if (!row) {
      return res.status(404).json({ error: "Plan not found" });
    }

    return res.json(row);
  } catch (err) {
    return next(err);
  }
});

router.patch("/content/:key", authMiddleware, async (req, res, next) => {
  try {
    const key = decodeURIComponent(req.params.key || "");
    const { value } = req.body || {};

    if (value === undefined || value === null) {
      return res.status(400).json({ error: "value is required" });
    }

    const updatedAt = new Date().toISOString();
    const { rows } = await query(
      `INSERT INTO site_content (key, value, updated_at)
       VALUES ($1, $2, $3)
       ON CONFLICT (key) DO UPDATE SET
         value = EXCLUDED.value,
         updated_at = EXCLUDED.updated_at
       RETURNING *`,
      [key, String(value), updatedAt]
    );

    return res.json(rows[0]);
  } catch (err) {
    return next(err);
  }
});

router.patch("/services/:id", authMiddleware, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid service id" });
    }

    const allowed = ["title", "description", "icon", "sort_order"];
    const body = req.body || {};
    const patch = {};

    for (const key of allowed) {
      if (
        Object.prototype.hasOwnProperty.call(body, key) &&
        body[key] !== undefined
      ) {
        patch[key] = body[key];
      }
    }

    if (patch.sort_order !== undefined) {
      patch.sort_order = parseInt(patch.sort_order, 10);
      if (Number.isNaN(patch.sort_order)) {
        return res.status(400).json({ error: "sort_order must be a number" });
      }
    }

    if (Object.keys(patch).length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    patch.updated_at = new Date().toISOString();

    const keys = Object.keys(patch);
    const values = keys.map((k) => patch[k]);
    const setParts = keys.map((k, i) => `${k} = $${i + 1}`);
    const idParam = keys.length + 1;
    const sql = `UPDATE services SET ${setParts.join(", ")} WHERE id = $${idParam} RETURNING *`;
    const { rows } = await query(sql, [...values, id]);

    const row = rows[0];
    if (!row) {
      return res.status(404).json({ error: "Service not found" });
    }

    return res.json(row);
  } catch (err) {
    return next(err);
  }
});

router.post("/admin/change-password", authMiddleware, async (req, res, next) => {
  try {
    const { current_password, new_password } = req.body || {};
    if (!current_password || !new_password) {
      return res.status(400).json({
        error: "current_password and new_password are required",
      });
    }
    if (String(new_password).length < 8) {
      return res.status(400).json({
        error: "New password must be at least 8 characters",
      });
    }

    const { rows } = await query(
      `SELECT id, password_hash FROM admin_users WHERE id = $1 LIMIT 1`,
      [req.user.id]
    );
    const user = rows[0];

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const ok = await bcrypt.compare(String(current_password), user.password_hash);
    if (!ok) {
      return res.status(401).json({ error: "Invalid current password" });
    }

    const password_hash = await bcrypt.hash(String(new_password), 10);

    await query(`UPDATE admin_users SET password_hash = $1 WHERE id = $2`, [
      password_hash,
      user.id,
    ]);

    return res.json({ success: true });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
