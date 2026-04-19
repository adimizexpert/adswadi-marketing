const express = require("express");
const rateLimit = require("express-rate-limit");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { query } = require("../db");

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts, try again later" },
});

router.post("/login", loginLimiter, async (req, res, next) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password required" });
    }

    const { rows } = await query(
      `SELECT id, username, password_hash FROM admin_users WHERE username = $1 LIMIT 1`,
      [String(username)]
    );
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const match = await bcrypt.compare(String(password), user.password_hash);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET || String(process.env.JWT_SECRET).length < 8) {
      console.error("[auth] JWT_SECRET is missing or too short");
      return res.status(500).json({
        error: "Server misconfiguration: set JWT_SECRET on the API (e.g. Render env)",
      });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
