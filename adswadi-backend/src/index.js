require("dotenv").config();

const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/auth");
const contentRoutes = require("./routes/content");
const paymentRoutes = require("./routes/payment");

const app = express();

app.set("trust proxy", 1);

app.use(express.json({ limit: "1mb" }));

const frontend = process.env.FRONTEND_URL;
app.use(
  cors({
    origin: frontend || false,
    credentials: true,
  })
);

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(globalLimiter);

app.use("/api", authRoutes);
app.use("/api", paymentRoutes);
app.use("/api", contentRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  const status = err.statusCode || err.status || 500;
  const message =
    err.message && status !== 500 ? err.message : "Internal server error";
  res.status(status).json({ error: message });
});

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

const port = Number(process.env.PORT) || 3001;
app.listen(port, () => {
  console.log(`Adswadi SMM API listening on port ${port}`);
});
