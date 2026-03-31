"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { AlertCircle, Check, Copy, Loader2, Smartphone } from "lucide-react";
import type { PaymentConfig } from "@/lib/paymentTypes";
import { defaultPaymentConfig } from "@/lib/paymentDefaults";
import {
  buildUpiPayHref,
  buildUpiQrApiUrl,
  buildWaMeUrl,
  formatRupeesInr,
  parseAmountParam,
} from "@/lib/upi";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

export default function PaymentPageClient() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name")?.trim() || "Service";
  const amountRaw = searchParams.get("amount");

  const [payment, setPayment] = useState<PaymentConfig | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "ok" | "error">("loading");
  const [loadError, setLoadError] = useState("");
  const [copied, setCopied] = useState(false);
  const [qrBroken, setQrBroken] = useState(false);

  const parsedAmount = useMemo(() => parseAmountParam(amountRaw), [amountRaw]);

  const fetchConfig = useCallback(async () => {
    if (!API_BASE) {
      setLoadState("error");
      setLoadError("NEXT_PUBLIC_API_URL is not configured.");
      return;
    }
    setLoadState("loading");
    setLoadError("");
    try {
      const res = await fetch(`${API_BASE}/api/config`);
      if (!res.ok) throw new Error(`Failed to load (${res.status})`);
      const data = (await res.json()) as { payment?: PaymentConfig };
      const p = data.payment ?? defaultPaymentConfig;
      setPayment({
        upiId: p.upiId ?? "",
        upiName: p.upiName?.slice(0, 50) || defaultPaymentConfig.upiName,
        whatsappNumber: p.whatsappNumber ?? "",
        qrImageUrl: p.qrImageUrl,
      });
      setLoadState("ok");
    } catch (e) {
      setLoadState("error");
      setLoadError(e instanceof Error ? e.message : "Could not load payment settings.");
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const upiHref = useMemo(() => {
    if (!payment?.upiId) return "";
    return buildUpiPayHref(
      payment.upiId,
      payment.upiName || "Merchant",
      parsedAmount
    );
  }, [payment, parsedAmount]);

  const qrSrc = useMemo(() => {
    if (!payment?.upiId || !API_BASE) return "";
    return buildUpiQrApiUrl(
      API_BASE,
      payment.upiId,
      payment.upiName || "Merchant",
      parsedAmount
    );
  }, [payment, parsedAmount]);

  const waScreenshotUrl = useMemo(() => {
    if (!payment?.whatsappNumber) return "";
    const base = buildWaMeUrl(payment.whatsappNumber);
    if (!base) return "";
    const amt =
      parsedAmount !== null
        ? ` Amount: ${formatRupeesInr(parsedAmount)}.`
        : "";
    const text = `Hi, I made a UPI payment for "${name}".${amt} Here is the payment screenshot.`;
    return `${base}?text=${encodeURIComponent(text)}`;
  }, [payment, parsedAmount, name]);

  const copyUpi = async () => {
    if (!payment?.upiId) return;
    try {
      await navigator.clipboard.writeText(payment.upiId);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  if (loadState === "loading") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 pt-24">
        <Loader2 className="h-10 w-10 animate-spin text-[#7C3AED]" aria-hidden />
        <p className="text-sm font-medium text-gray-600">Loading payment options…</p>
      </div>
    );
  }

  if (loadState === "error") {
    return (
      <div className="mx-auto max-w-lg px-4 pt-24">
        <div className="rounded-2xl border border-red-200 bg-red-50/90 p-6 text-center shadow-sm">
          <AlertCircle className="mx-auto h-10 w-10 text-red-600" aria-hidden />
          <p className="mt-3 font-semibold text-red-900">Couldn’t load payment settings</p>
          <p className="mt-2 text-sm text-red-800/90">{loadError}</p>
          <button
            type="button"
            onClick={fetchConfig}
            className="mt-6 rounded-full border-2 border-red-300 bg-white px-6 py-2 text-sm font-semibold text-red-800 hover:bg-red-50"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const configured = Boolean(payment?.upiId?.trim());

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#EDE0FF] via-[#FAF5FF] to-white pb-20 pt-24 sm:pt-28">
      <div
        className="pointer-events-none absolute -left-40 top-0 h-[400px] w-[400px] rounded-full bg-[#7C3AED]/10 blur-[100px]"
        aria-hidden
      />
      <div className="relative z-[1] mx-auto max-w-lg px-4 sm:px-6">
        <div className="rounded-3xl border border-purple-100/80 bg-white/90 p-6 shadow-card backdrop-blur-sm sm:p-8">
          <h1 className="text-center text-2xl font-extrabold text-[#7C3AED] sm:text-3xl">
            Pay for {name}
          </h1>
          <p className="mt-4 text-center text-sm leading-relaxed text-gray-600">
            Pay securely with any UPI app (PhonePe, Google Pay, Paytm, BHIM, etc.). Your
            payment is processed by your bank; we do not store card or UPI PIN.
          </p>

          {parsedAmount !== null && (
            <p className="mt-6 text-center text-3xl font-bold text-gray-900 tabular-nums">
              {formatRupeesInr(parsedAmount)}
            </p>
          )}

          {!configured || !payment ? (
            <p className="mt-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-900">
              UPI payment is not configured yet. Please contact us on WhatsApp from the
              contact section.
            </p>
          ) : (
            <>
              <div className="mt-8 flex flex-col items-center">
                {!qrBroken && qrSrc ? (
                  <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-inner">
                    <Image
                      src={qrSrc}
                      alt="Scan to pay with UPI"
                      width={280}
                      height={280}
                      className="h-auto w-[280px] max-w-full"
                      unoptimized
                      onError={() => setQrBroken(true)}
                    />
                  </div>
                ) : (
                  <p className="text-center text-sm text-gray-500">
                    QR could not be loaded. Use “Pay now” or copy the UPI ID below.
                  </p>
                )}
                <p className="mt-3 text-xs text-gray-500">Scan with any UPI app</p>
              </div>

              <a
                href={upiHref}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#EC4899] px-6 py-4 text-base font-bold text-white shadow-lg shadow-purple-900/30 transition hover:opacity-95 focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2"
              >
                <Smartphone className="h-5 w-5 shrink-0" aria-hidden />
                Pay now
              </a>

              <div className="mt-8 rounded-2xl border border-purple-100 bg-purple-50/50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#7C3AED]/80">
                  UPI ID
                </p>
                <p className="mt-1 break-all font-mono text-base font-semibold text-gray-900">
                  {payment.upiId}
                </p>
                <button
                  type="button"
                  onClick={copyUpi}
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#7C3AED] bg-white px-4 py-2.5 text-sm font-semibold text-[#7C3AED] transition hover:bg-[#7C3AED] hover:text-white"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" aria-hidden />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" aria-hidden />
                      Copy UPI ID
                    </>
                  )}
                </button>
              </div>

              {waScreenshotUrl && (
                <a
                  href={waScreenshotUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-4 text-base font-bold text-white shadow-lg shadow-green-900/20 ring-2 ring-white/30 transition hover:bg-[#20BD5A] focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#25D366]"
                >
                  Send payment screenshot on WhatsApp
                </a>
              )}

              <p className="mt-4 text-center text-xs text-gray-500">
                After paying, send us a screenshot so we can match your payment. No
                automatic confirmation is shown on this page.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
