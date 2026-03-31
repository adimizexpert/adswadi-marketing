const express = require("express");
const QRCode = require("qrcode");
const { query } = require("../db");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

const DEFAULT_PAYMENT = {
  upiId: "",
  upiName: "Merchant",
  whatsappNumber: "",
  qrImageUrl: "",
};

function parsePaymentRow(raw) {
  if (!raw || typeof raw !== "string") return { ...DEFAULT_PAYMENT };
  try {
    const o = JSON.parse(raw);
    return {
      upiId: typeof o.upiId === "string" ? o.upiId.trim() : "",
      upiName:
        typeof o.upiName === "string"
          ? o.upiName.trim().slice(0, 50)
          : DEFAULT_PAYMENT.upiName,
      whatsappNumber:
        typeof o.whatsappNumber === "string" ? o.whatsappNumber.trim() : "",
      qrImageUrl:
        typeof o.qrImageUrl === "string" ? o.qrImageUrl.trim() : "",
    };
  } catch {
    return { ...DEFAULT_PAYMENT };
  }
}

/** Strip commas; return positive finite number or null */
function parseAmountQuery(am) {
  if (am === undefined || am === null || am === "") return null;
  const s = String(am).replace(/,/g, "").trim();
  if (!s) return null;
  const n = Number.parseFloat(s);
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.round(n * 100) / 100;
}

function buildUpiPayUri(pa, pn, amount) {
  const params = new URLSearchParams();
  params.set("pa", pa);
  params.set("pn", pn);
  params.set("cu", "INR");
  if (amount !== null && amount > 0) {
    params.set("am", amount.toFixed(2));
  }
  return `upi://pay?${params.toString()}`;
}

router.get("/config", async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT value FROM site_content WHERE key = 'payment_config' LIMIT 1`
    );
    const payment = parsePaymentRow(rows[0]?.value);
    return res.json({ payment });
  } catch (err) {
    return next(err);
  }
});

router.get("/upi-qr", async (req, res, next) => {
  try {
    const pa = String(req.query.pa || "").trim();
    if (!pa) {
      res.status(400).setHeader("Content-Type", "text/plain");
      return res.send("Missing pa (VPA)");
    }
    let pn = String(req.query.pn || "Merchant").trim();
    if (!pn) pn = "Merchant";
    pn = pn.slice(0, 50);
    const amount = parseAmountQuery(req.query.am);
    const uri = buildUpiPayUri(pa, pn, amount);

    const png = await QRCode.toBuffer(uri, {
      type: "png",
      width: 280,
      margin: 2,
      errorCorrectionLevel: "M",
    });

    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "private, max-age=300");
    return res.send(png);
  } catch (err) {
    return next(err);
  }
});

router.patch("/payment-config", authMiddleware, async (req, res, next) => {
  try {
    const body = req.body || {};
    const upiId = typeof body.upiId === "string" ? body.upiId.trim() : "";
    let upiName =
      typeof body.upiName === "string" ? body.upiName.trim() : DEFAULT_PAYMENT.upiName;
    if (!upiName) upiName = DEFAULT_PAYMENT.upiName;
    upiName = upiName.slice(0, 50);
    const whatsappNumber =
      typeof body.whatsappNumber === "string"
        ? body.whatsappNumber.trim()
        : "";
    const qrImageUrl =
      typeof body.qrImageUrl === "string" ? body.qrImageUrl.trim() : "";

    const payment = {
      upiId,
      upiName,
      whatsappNumber,
      qrImageUrl,
    };

    const updatedAt = new Date().toISOString();
    await query(
      `INSERT INTO site_content (key, value, updated_at)
       VALUES ('payment_config', $1, $2)
       ON CONFLICT (key) DO UPDATE SET
         value = EXCLUDED.value,
         updated_at = EXCLUDED.updated_at`,
      [JSON.stringify(payment), updatedAt]
    );

    return res.json({ payment });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
