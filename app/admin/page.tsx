"use client";

import { useCallback, useEffect, useState } from "react";
import type { CmsPlan, CmsService, SiteContentMap } from "@/lib/api";
import { defaultContent } from "@/lib/cmsDefaults";
import { CMS_MEDIA_KEYS, parseMediaItems } from "@/lib/mediaCms";
import type { PortfolioImageItem } from "@/lib/portfolioContent";
import {
  portfolioInstagramItems,
  portfolioUgcItems,
  portfolioYoutubeItems,
  youtubeShowcaseMediaFallback,
} from "@/lib/portfolioContent";
import type { PaymentConfig } from "@/lib/paymentTypes";
import { defaultPaymentConfig } from "@/lib/paymentDefaults";
import { isJwtExpired } from "@/lib/jwtClient";

const TOKEN_KEY = "adswadi_admin_token";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

type Tab = "pricing" | "content" | "media" | "payment" | "services" | "password";

const ACCENT_OPTIONS = ["", "violet", "rose", "amber", "cyan", "emerald", "indigo"] as const;

const MEDIA_GROUPS: {
  key: string;
  label: string;
  fallback: PortfolioImageItem[];
}[] = [
  {
    key: CMS_MEDIA_KEYS.youtubeShowcase,
    label: "Home — YouTube showcase (4 thumbnails under packages)",
    fallback: youtubeShowcaseMediaFallback,
  },
  {
    key: CMS_MEDIA_KEYS.portfolioYoutube,
    label: "Portfolio page — YouTube grid",
    fallback: portfolioYoutubeItems,
  },
  {
    key: CMS_MEDIA_KEYS.portfolioInstagram,
    label: "Portfolio page — Instagram grid",
    fallback: portfolioInstagramItems,
  },
  {
    key: CMS_MEDIA_KEYS.portfolioUgc,
    label: "Portfolio page — UGC grid",
    fallback: portfolioUgcItems,
  },
];

function buildMediaDraft(content: SiteContentMap): Record<string, PortfolioImageItem[]> {
  const out: Record<string, PortfolioImageItem[]> = {};
  for (const { key, fallback } of MEDIA_GROUPS) {
    out[key] = parseMediaItems(content[key], fallback);
  }
  return out;
}

const CONTENT_FIELDS: { key: keyof SiteContentMap | string; label: string }[] = [
  { key: "whatsapp_number", label: "WhatsApp Number (digits, e.g. 919876543210)" },
  { key: "hero_headline_line1", label: "Hero — Line 1 (purple)" },
  { key: "hero_headline_line2", label: "Hero — Line 2 (pink)" },
  { key: "hero_subheadline", label: "Hero — Subheadline" },
  { key: "hero_subtext_line2", label: "Hero — Second line (below break)" },
  { key: "cta_section_headline", label: "CTA Section — Headline" },
  { key: "cta_section_subtext", label: "CTA Section — Subtext" },
  { key: "footer_tagline", label: "Footer — Tagline" },
];

function tabClass(active: boolean) {
  return `rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
    active
      ? "bg-[#7C3AED] text-white shadow-md"
      : "bg-white/80 text-gray-700 ring-1 ring-purple-100 hover:bg-purple-50"
  }`;
}

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [busy, setBusy] = useState(false);
  const [banner, setBanner] = useState<{ type: "ok" | "err"; text: string } | null>(
    null
  );

  const [tab, setTab] = useState<Tab>("pricing");

  const [plans, setPlans] = useState<CmsPlan[]>([]);
  const [contentForm, setContentForm] = useState<SiteContentMap>(defaultContent);
  const [mediaDraft, setMediaDraft] = useState<Record<string, PortfolioImageItem[]>>(() =>
    buildMediaDraft(defaultContent)
  );
  const [services, setServices] = useState<CmsService[]>([]);
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig>(defaultPaymentConfig);

  const [pwdCurrent, setPwdCurrent] = useState("");
  const [pwdNew, setPwdNew] = useState("");
  const [pwdConfirm, setPwdConfirm] = useState("");

  const authHeaders = useCallback((): Record<string, string> => {
    const t =
      token ||
      (typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null);
    const h: Record<string, string> = {};
    if (t) {
      h.Authorization = `Bearer ${t}`;
    }
    return h;
  }, [token]);

  const loadPublicData = useCallback(async () => {
    if (!API_BASE) {
      setBanner({ type: "err", text: "Set NEXT_PUBLIC_API_URL in .env.local" });
      return;
    }
    const [pRes, cRes, sRes, cfgRes] = await Promise.all([
      fetch(`${API_BASE}/api/plans`),
      fetch(`${API_BASE}/api/content`),
      fetch(`${API_BASE}/api/services`),
      fetch(`${API_BASE}/api/config`),
    ]);
    if (pRes.ok) {
      const data = (await pRes.json()) as CmsPlan[];
      setPlans(Array.isArray(data) ? data : []);
    }
    if (cRes.ok) {
      const data = (await cRes.json()) as SiteContentMap;
      const merged = { ...defaultContent, ...data };
      setContentForm(merged);
      setMediaDraft(buildMediaDraft(merged));
    }
    if (sRes.ok) {
      const data = (await sRes.json()) as CmsService[];
      setServices(Array.isArray(data) ? data : []);
    }
    if (cfgRes.ok) {
      const data = (await cfgRes.json()) as { payment?: Partial<PaymentConfig> };
      const p = data.payment;
      setPaymentConfig({
        upiId: typeof p?.upiId === "string" ? p.upiId : "",
        upiName:
          typeof p?.upiName === "string"
            ? p.upiName.slice(0, 50)
            : defaultPaymentConfig.upiName,
        whatsappNumber:
          typeof p?.whatsappNumber === "string" ? p.whatsappNumber : "",
        qrImageUrl: typeof p?.qrImageUrl === "string" ? p.qrImageUrl : "",
      });
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const t = localStorage.getItem(TOKEN_KEY);
    if (t && !isJwtExpired(t)) {
      setToken(t);
    } else if (t) {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, []);

  useEffect(() => {
    if (!token) return;
    loadPublicData();
  }, [token, loadPublicData]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    setBusy(true);
    try {
      if (!API_BASE) {
        setLoginError("NEXT_PUBLIC_API_URL is not set");
        return;
      }
      const res = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setLoginError((data as { error?: string }).error || "Login failed");
        return;
      }
      const t = (data as { token?: string }).token;
      if (!t) {
        setLoginError("No token returned");
        return;
      }
      localStorage.setItem(TOKEN_KEY, t);
      setToken(t);
      setPassword("");
    } finally {
      setBusy(false);
    }
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }

  async function savePlan(plan: CmsPlan, draft: PlanDraft) {
    setBusy(true);
    setBanner(null);
    try {
      const features = draft.featuresText
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
      const res = await fetch(`${API_BASE}/api/plans/${plan.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify({
          price: Number(draft.price),
          label: draft.label,
          badge: draft.badge.trim() === "" ? null : draft.badge.trim(),
          features,
          cta_text: draft.cta_text,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setBanner({ type: "err", text: (data as { error?: string }).error || "Save failed" });
        return;
      }
      setBanner({ type: "ok", text: `Plan ${plan.name} saved.` });
      await loadPublicData();
    } finally {
      setBusy(false);
    }
  }

  async function saveMedia() {
    setBusy(true);
    setBanner(null);
    try {
      for (const { key } of MEDIA_GROUPS) {
        const rows = mediaDraft[key] ?? [];
        const json = JSON.stringify(
          rows.map((r) => {
            const o: Record<string, string> = {
              title: r.title,
              subtitle: r.subtitle,
            };
            if (r.url?.trim()) o.url = r.url.trim();
            if (r.accent) o.accent = r.accent;
            return o;
          })
        );
        const res = await fetch(`${API_BASE}/api/content/${encodeURIComponent(key)}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...authHeaders(),
          },
          body: JSON.stringify({ value: json }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setBanner({
            type: "err",
            text: (data as { error?: string }).error || `Failed on ${key}`,
          });
          return;
        }
      }
      setBanner({ type: "ok", text: "Media slots saved." });
      await loadPublicData();
    } finally {
      setBusy(false);
    }
  }

  async function savePayment() {
    setBusy(true);
    setBanner(null);
    try {
      const res = await fetch(`${API_BASE}/api/payment-config`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify(paymentConfig),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setBanner({
          type: "err",
          text: (data as { error?: string }).error || "Save failed",
        });
        return;
      }
      setBanner({ type: "ok", text: "UPI payment settings saved." });
      await loadPublicData();
    } finally {
      setBusy(false);
    }
  }

  async function saveAllContent() {
    setBusy(true);
    setBanner(null);
    try {
      for (const { key } of CONTENT_FIELDS) {
        const value = contentForm[key as string] ?? "";
        const res = await fetch(
          `${API_BASE}/api/content/${encodeURIComponent(key)}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              ...authHeaders(),
            },
            body: JSON.stringify({ value }),
          }
        );
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setBanner({
            type: "err",
            text: (data as { error?: string }).error || `Failed on ${key}`,
          });
          return;
        }
      }
      setBanner({ type: "ok", text: "Site content saved." });
      await loadPublicData();
    } finally {
      setBusy(false);
    }
  }

  async function saveService(svc: CmsService) {
    setBusy(true);
    setBanner(null);
    try {
      const res = await fetch(`${API_BASE}/api/services/${svc.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify({
          title: svc.title,
          description: svc.description,
          icon: svc.icon,
          sort_order: svc.sort_order,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setBanner({ type: "err", text: (data as { error?: string }).error || "Save failed" });
        return;
      }
      setBanner({ type: "ok", text: `Service “${svc.title}” saved.` });
      await loadPublicData();
    } finally {
      setBusy(false);
    }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setBanner(null);
    if (pwdNew !== pwdConfirm) {
      setBanner({ type: "err", text: "New passwords do not match" });
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify({
          current_password: pwdCurrent,
          new_password: pwdNew,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setBanner({ type: "err", text: (data as { error?: string }).error || "Failed" });
        return;
      }
      setBanner({ type: "ok", text: "Password updated. Use the new password next login." });
      setPwdCurrent("");
      setPwdNew("");
      setPwdConfirm("");
    } finally {
      setBusy(false);
    }
  }

  if (!API_BASE) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#EDE0FF] via-[#FAE0F5] to-[#F0F4FF] px-4 py-16">
        <div className="mx-auto max-w-lg rounded-2xl border border-purple-100 bg-white p-8 shadow-card">
          <h1 className="text-xl font-bold text-[#7C3AED]">Adswadi SMM Admin</h1>
          <p className="mt-2 text-gray-600">
            Add{" "}
            <code className="rounded bg-purple-50 px-1">NEXT_PUBLIC_API_URL</code>{" "}
            to <code className="rounded bg-purple-50 px-1">.env.local</code> and
            restart Next.js.
          </p>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#EDE0FF] via-[#FAE0F5] to-[#F0F4FF] px-4 py-16">
        <div className="mx-auto max-w-md rounded-2xl border border-purple-100 bg-white p-8 shadow-card">
          <h1 className="bg-gradient-to-r from-[#7C3AED] to-[#EC4899] bg-clip-text text-2xl font-extrabold text-transparent">
            Adswadi SMM Admin
          </h1>
          <p className="mt-2 text-sm text-gray-600">Sign in to manage landing content.</p>
          <p className="mt-3 rounded-lg border border-purple-100 bg-purple-50/80 px-3 py-2 text-xs leading-relaxed text-gray-700">
            Sessions last <strong>30 days</strong>, then you need to sign in again. If login fails:
            check your password; wait 15 minutes after many failed attempts; confirm{" "}
            <code className="rounded bg-white px-1">NEXT_PUBLIC_API_URL</code> matches your live API.
            Default seed credentials are documented in{" "}
            <code className="rounded bg-white px-1">adswadi-backend/README.md</code> (change them in production).
          </p>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                className="mt-1 w-full rounded-xl border border-purple-100 px-3 py-2 text-gray-900 outline-none ring-purple-200 focus:ring-2"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                className="mt-1 w-full rounded-xl border border-purple-100 px-3 py-2 text-gray-900 outline-none ring-purple-200 focus:ring-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            {loginError && (
              <p className="text-sm font-medium text-red-600">{loginError}</p>
            )}
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-full border-2 border-[#7C3AED] bg-[#7C3AED] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#6d28d9] disabled:opacity-60"
            >
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EDE0FF] via-[#FAE0F5] to-[#F0F4FF] px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="bg-gradient-to-r from-[#7C3AED] to-[#EC4899] bg-clip-text text-2xl font-extrabold text-transparent sm:text-3xl">
              Adswadi SMM CMS
            </h1>
            <p className="text-sm text-gray-600">API: {API_BASE}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="self-start rounded-full border-2 border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 hover:border-[#7C3AED] hover:text-[#7C3AED]"
          >
            Log out
          </button>
        </header>

        {banner && (
          <div
            className={`mt-6 rounded-xl border px-4 py-3 text-sm font-medium ${
              banner.type === "ok"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-red-200 bg-red-50 text-red-800"
            }`}
          >
            {banner.text}
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-2">
          {(
            [
              ["pricing", "Pricing"],
              ["content", "Site content"],
              ["media", "Media"],
              ["payment", "UPI payment"],
              ["services", "Services"],
              ["password", "Password"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={tabClass(tab === id)}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-purple-100 bg-white/90 p-6 shadow-card backdrop-blur-sm sm:p-8">
          {tab === "pricing" && (
            <PricingTab
              plans={plans}
              busy={busy}
              onSave={savePlan}
            />
          )}
          {tab === "content" && (
            <div className="space-y-6">
              {CONTENT_FIELDS.map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700">
                    {label}
                  </label>
                  <textarea
                    rows={key.includes("subtext") || key.includes("headline") ? 2 : 1}
                    className="mt-1 w-full rounded-xl border border-purple-100 px-3 py-2 text-gray-900 outline-none ring-purple-200 focus:ring-2"
                    value={contentForm[key as string] ?? ""}
                    onChange={(e) =>
                      setContentForm((prev) => ({
                        ...prev,
                        [key]: e.target.value,
                      }))
                    }
                  />
                </div>
              ))}
              <button
                type="button"
                disabled={busy}
                onClick={saveAllContent}
                className="rounded-full border-2 border-[#7C3AED] bg-[#7C3AED] px-8 py-3 text-sm font-semibold text-white hover:bg-[#6d28d9] disabled:opacity-60"
              >
                {busy ? "Saving…" : "Save all"}
              </button>
            </div>
          )}
          {tab === "media" && (
            <div className="space-y-10">
              <p className="text-sm text-gray-600">
                Image URL (https://…), titles, and optional accent for gradient placeholders. Leave URL
                empty to use the colored placeholder.
              </p>
              {MEDIA_GROUPS.map(({ key, label }) => (
                <div key={key} className="rounded-2xl border border-purple-100 bg-gradient-to-br from-white to-violet-50/30 p-6">
                  <h2 className="text-lg font-bold text-[#7C3AED]">{label}</h2>
                  <div className="mt-4 space-y-4">
                    {(mediaDraft[key] ?? []).map((row, idx) => (
                      <div
                        key={row.id}
                        className="grid gap-3 rounded-xl border border-purple-100/80 bg-white/90 p-4 sm:grid-cols-2 lg:grid-cols-4"
                      >
                        <div className="sm:col-span-2 lg:col-span-1">
                          <label className="text-xs font-medium text-gray-600">Image URL</label>
                          <input
                            className="mt-1 w-full rounded-lg border border-purple-100 px-2 py-1.5 text-sm"
                            placeholder="https://…"
                            value={row.url ?? ""}
                            onChange={(e) =>
                              setMediaDraft((prev) => {
                                const next = { ...prev };
                                const list = [...(next[key] ?? [])];
                                list[idx] = { ...list[idx], url: e.target.value };
                                next[key] = list;
                                return next;
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-600">Title</label>
                          <input
                            className="mt-1 w-full rounded-lg border border-purple-100 px-2 py-1.5 text-sm"
                            value={row.title}
                            onChange={(e) =>
                              setMediaDraft((prev) => {
                                const next = { ...prev };
                                const list = [...(next[key] ?? [])];
                                list[idx] = { ...list[idx], title: e.target.value };
                                next[key] = list;
                                return next;
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-600">Subtitle</label>
                          <input
                            className="mt-1 w-full rounded-lg border border-purple-100 px-2 py-1.5 text-sm"
                            value={row.subtitle}
                            onChange={(e) =>
                              setMediaDraft((prev) => {
                                const next = { ...prev };
                                const list = [...(next[key] ?? [])];
                                list[idx] = { ...list[idx], subtitle: e.target.value };
                                next[key] = list;
                                return next;
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-600">Accent</label>
                          <select
                            className="mt-1 w-full rounded-lg border border-purple-100 px-2 py-1.5 text-sm"
                            value={row.accent ?? ""}
                            onChange={(e) =>
                              setMediaDraft((prev) => {
                                const next = { ...prev };
                                const list = [...(next[key] ?? [])];
                                const v = e.target.value;
                                list[idx] = {
                                  ...list[idx],
                                  accent:
                                    v === ""
                                      ? undefined
                                      : (v as NonNullable<PortfolioImageItem["accent"]>),
                                };
                                next[key] = list;
                                return next;
                              })
                            }
                          >
                            {ACCENT_OPTIONS.map((opt) => (
                              <option key={opt || "default"} value={opt}>
                                {opt === "" ? "(default)" : opt}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button
                type="button"
                disabled={busy}
                onClick={saveMedia}
                className="rounded-full border-2 border-[#7C3AED] bg-[#7C3AED] px-8 py-3 text-sm font-semibold text-white hover:bg-[#6d28d9] disabled:opacity-60"
              >
                {busy ? "Saving…" : "Save media"}
              </button>
            </div>
          )}
          {tab === "payment" && (
            <div className="mx-auto max-w-xl space-y-5">
              <p className="text-sm text-gray-600">
                Manual UPI checkout: customers pay in any UPI app and send a screenshot on WhatsApp.
                QR codes are generated from this data — no static QR image required.
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700">UPI ID (VPA)</label>
                <input
                  className="mt-1 w-full rounded-xl border border-purple-100 px-3 py-2 font-mono text-sm"
                  placeholder="name@paytm"
                  value={paymentConfig.upiId}
                  onChange={(e) =>
                    setPaymentConfig((prev) => ({ ...prev, upiId: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Payee display name (max 50 chars)
                </label>
                <input
                  className="mt-1 w-full rounded-xl border border-purple-100 px-3 py-2 text-sm"
                  maxLength={50}
                  value={paymentConfig.upiName}
                  onChange={(e) =>
                    setPaymentConfig((prev) => ({
                      ...prev,
                      upiName: e.target.value.slice(0, 50),
                    }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  WhatsApp for payment screenshots (digits; + optional)
                </label>
                <input
                  className="mt-1 w-full rounded-xl border border-purple-100 px-3 py-2 text-sm"
                  placeholder="919876543210"
                  value={paymentConfig.whatsappNumber}
                  onChange={(e) =>
                    setPaymentConfig((prev) => ({
                      ...prev,
                      whatsappNumber: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Legacy QR image URL (optional, stored only — not used on site)
                </label>
                <input
                  className="mt-1 w-full rounded-xl border border-purple-100 px-3 py-2 text-sm"
                  placeholder="https://…"
                  value={paymentConfig.qrImageUrl ?? ""}
                  onChange={(e) =>
                    setPaymentConfig((prev) => ({
                      ...prev,
                      qrImageUrl: e.target.value,
                    }))
                  }
                />
              </div>
              <button
                type="button"
                disabled={busy}
                onClick={savePayment}
                className="rounded-full border-2 border-[#7C3AED] bg-[#7C3AED] px-8 py-3 text-sm font-semibold text-white hover:bg-[#6d28d9] disabled:opacity-60"
              >
                {busy ? "Saving…" : "Save payment settings"}
              </button>
            </div>
          )}
          {tab === "services" && (
            <ServicesEditor
              services={services}
              busy={busy}
              onChange={setServices}
              onSave={saveService}
            />
          )}
          {tab === "password" && (
            <form onSubmit={changePassword} className="max-w-md space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Current password
                </label>
                <input
                  type="password"
                  className="mt-1 w-full rounded-xl border border-purple-100 px-3 py-2"
                  value={pwdCurrent}
                  onChange={(e) => setPwdCurrent(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  New password
                </label>
                <input
                  type="password"
                  className="mt-1 w-full rounded-xl border border-purple-100 px-3 py-2"
                  value={pwdNew}
                  onChange={(e) => setPwdNew(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm new password
                </label>
                <input
                  type="password"
                  className="mt-1 w-full rounded-xl border border-purple-100 px-3 py-2"
                  value={pwdConfirm}
                  onChange={(e) => setPwdConfirm(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
              <button
                type="submit"
                disabled={busy}
                className="rounded-full border-2 border-[#7C3AED] bg-white px-8 py-3 text-sm font-semibold text-[#7C3AED] hover:bg-[#7C3AED] hover:text-white disabled:opacity-60"
              >
                {busy ? "Updating…" : "Change password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

type PlanDraft = {
  price: number;
  label: string;
  badge: string;
  cta_text: string;
  featuresText: string;
};

function PricingTab({
  plans,
  busy,
  onSave,
}: {
  plans: CmsPlan[];
  busy: boolean;
  onSave: (plan: CmsPlan, draft: PlanDraft) => void | Promise<void>;
}) {
  const youtubePlans = plans.filter(
    (p) => p.platform === "youtube" || p.platform === undefined
  );
  const instagramPlans = plans.filter((p) => p.platform === "instagram");

  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-xl font-bold text-gray-900">YouTube packages</h2>
        <p className="mt-1 text-sm text-gray-600">
          These cards appear in the <strong>YouTube packages</strong> block on the homepage.
          Each save only updates that row (by ID).
        </p>
        <div className="mt-6 space-y-10">
          {youtubePlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} busy={busy} onSave={onSave} />
          ))}
        </div>
        {youtubePlans.length === 0 && (
          <p className="mt-4 text-gray-600">No YouTube plans in the database.</p>
        )}
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900">Instagram packages</h2>
        <p className="mt-1 text-sm text-gray-600">
          Separate rows for the <strong>Instagram packages</strong> section — edit prices and copy
          independently from YouTube.
        </p>
        <div className="mt-6 space-y-10">
          {instagramPlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} busy={busy} onSave={onSave} />
          ))}
        </div>
        {instagramPlans.length === 0 && (
          <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            No Instagram plans found. Restart the API once so the database migration can add the
            Instagram tier rows, then refresh this page.
          </p>
        )}
      </section>

      {plans.length === 0 && (
        <p className="text-gray-600">No plans loaded. Check API and database seed.</p>
      )}
    </div>
  );
}

function parseFeatureLines(plan: CmsPlan): string[] {
  const raw = plan.features;
  if (Array.isArray(raw)) {
    return raw.map(String);
  }
  if (typeof raw === "string") {
    try {
      const p = JSON.parse(raw) as unknown;
      return Array.isArray(p) ? p.map(String) : [];
    } catch {
      return [];
    }
  }
  return [];
}

function PlanCard({
  plan,
  busy,
  onSave,
}: {
  plan: CmsPlan;
  busy: boolean;
  onSave: (plan: CmsPlan, draft: PlanDraft) => void | Promise<void>;
}) {
  const [price, setPrice] = useState(plan.price);
  const [label, setLabel] = useState(plan.label);
  const [badge, setBadge] = useState(plan.badge ?? "");
  const [cta_text, setCta] = useState(plan.cta_text);
  const [featuresText, setFeaturesText] = useState(() =>
    parseFeatureLines(plan).join("\n")
  );

  useEffect(() => {
    setPrice(plan.price);
    setLabel(plan.label);
    setBadge(plan.badge ?? "");
    setCta(plan.cta_text);
    setFeaturesText(parseFeatureLines(plan).join("\n"));
  }, [plan]);

  const title =
    plan.name.charAt(0).toUpperCase() + plan.name.slice(1).toLowerCase();
  const platformLabel =
    plan.platform === "instagram" ? "Instagram" : "YouTube";

  return (
    <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-white to-purple-50/40 p-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-[#EC4899]">
        {platformLabel}
      </p>
      <h2 className="mt-1 text-lg font-bold text-[#7C3AED]">{title}</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-gray-700">Price (₹ / month)</label>
          <input
            type="number"
            className="mt-1 w-full rounded-xl border border-purple-100 px-3 py-2"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Label (pack name)</label>
          <input
            className="mt-1 w-full rounded-xl border border-purple-100 px-3 py-2"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm font-medium text-gray-700">
            Badge (e.g. Most Popular — leave empty for none)
          </label>
          <input
            className="mt-1 w-full rounded-xl border border-purple-100 px-3 py-2"
            value={badge}
            onChange={(e) => setBadge(e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm font-medium text-gray-700">CTA button text</label>
          <input
            className="mt-1 w-full rounded-xl border border-purple-100 px-3 py-2"
            value={cta_text}
            onChange={(e) => setCta(e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm font-medium text-gray-700">
            Features (one per line)
          </label>
          <textarea
            rows={6}
            className="mt-1 w-full rounded-xl border border-purple-100 px-3 py-2 font-mono text-sm"
            value={featuresText}
            onChange={(e) => setFeaturesText(e.target.value)}
          />
        </div>
      </div>
      <button
        type="button"
        disabled={busy}
        onClick={() =>
          onSave(plan, { price, label, badge, cta_text, featuresText })
        }
        className="mt-6 rounded-full border-2 border-[#7C3AED] px-8 py-2.5 text-sm font-semibold text-[#7C3AED] hover:bg-[#7C3AED] hover:text-white disabled:opacity-60"
      >
        Save {title}
      </button>
    </div>
  );
}

function ServicesEditor({
  services,
  busy,
  onChange,
  onSave,
}: {
  services: CmsService[];
  busy: boolean;
  onChange: (s: CmsService[]) => void;
  onSave: (s: CmsService) => void | Promise<void>;
}) {
  return (
    <div className="space-y-10">
      {services.map((svc) => (
        <div
          key={svc.id}
          className="rounded-2xl border border-purple-100 bg-gradient-to-br from-white to-pink-50/30 p-6"
        >
          <h2 className="text-lg font-bold text-[#EC4899]">Service #{svc.id}</h2>
          <div className="mt-4 grid gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Icon key: filetext, clapperboard, or image</label>
              <input
                className="mt-1 w-full rounded-xl border border-purple-100 px-3 py-2"
                value={svc.icon ?? ""}
                onChange={(e) =>
                  onChange(
                    services.map((s) =>
                      s.id === svc.id ? { ...s, icon: e.target.value } : s
                    )
                  )
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Title</label>
              <input
                className="mt-1 w-full rounded-xl border border-purple-100 px-3 py-2"
                value={svc.title}
                onChange={(e) =>
                  onChange(
                    services.map((s) =>
                      s.id === svc.id ? { ...s, title: e.target.value } : s
                    )
                  )
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Description</label>
              <textarea
                rows={4}
                className="mt-1 w-full rounded-xl border border-purple-100 px-3 py-2"
                value={svc.description}
                onChange={(e) =>
                  onChange(
                    services.map((s) =>
                      s.id === svc.id ? { ...s, description: e.target.value } : s
                    )
                  )
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Sort order</label>
              <input
                type="number"
                className="mt-1 w-full max-w-xs rounded-xl border border-purple-100 px-3 py-2"
                value={svc.sort_order}
                onChange={(e) =>
                  onChange(
                    services.map((s) =>
                      s.id === svc.id
                        ? { ...s, sort_order: Number(e.target.value) }
                        : s
                    )
                  )
                }
              />
            </div>
            <button
              type="button"
              disabled={busy}
              onClick={() => onSave(svc)}
              className="self-start rounded-full border-2 border-[#EC4899] px-6 py-2 text-sm font-semibold text-[#EC4899] hover:bg-[#EC4899] hover:text-white disabled:opacity-60"
            >
              Save service
            </button>
          </div>
        </div>
      ))}
      {services.length === 0 && (
        <p className="text-gray-600">No services loaded.</p>
      )}
    </div>
  );
}
