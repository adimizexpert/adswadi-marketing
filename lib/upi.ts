/**
 * Parse amount from query (commas allowed). Returns null if invalid or non-positive.
 */
export function parseAmountParam(raw: string | null | undefined): number | null {
  if (raw === undefined || raw === null || raw === "") return null;
  const s = String(raw).replace(/,/g, "").trim();
  if (!s) return null;
  const n = Number.parseFloat(s);
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.round(n * 100) / 100;
}

export function formatRupeesInr(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/** Digits only for wa.me */
export function normalizeWhatsAppDigits(input: string): string {
  return input.replace(/\D/g, "");
}

export function buildWaMeUrl(digits: string): string {
  const d = normalizeWhatsAppDigits(digits);
  if (!d) return "";
  return `https://wa.me/${d}`;
}

export function buildUpiPayHref(
  pa: string,
  pn: string,
  amount: number | null
): string {
  const params = new URLSearchParams();
  params.set("pa", pa);
  params.set("pn", pn.slice(0, 50) || "Merchant");
  params.set("cu", "INR");
  if (amount !== null && amount > 0) {
    params.set("am", amount.toFixed(2));
  }
  return `upi://pay?${params.toString()}`;
}

export function buildUpiQrApiUrl(
  apiBase: string,
  pa: string,
  pn: string,
  amount: number | null
): string {
  const qs = new URLSearchParams();
  qs.set("pa", pa);
  qs.set("pn", pn.slice(0, 50) || "Merchant");
  if (amount !== null && amount > 0) {
    qs.set("am", String(amount));
  }
  const base = apiBase.replace(/\/$/, "");
  return `${base}/api/upi-qr?${qs.toString()}`;
}
