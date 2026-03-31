import type { PortfolioImageItem } from "./portfolioContent";

export const CMS_MEDIA_KEYS = {
  youtubeShowcase: "media_youtube_showcase",
  portfolioYoutube: "media_portfolio_youtube",
  portfolioInstagram: "media_portfolio_instagram",
  portfolioUgc: "media_portfolio_ugc",
} as const;

/**
 * Merge CMS JSON with static fallbacks by index (same length as fallbacks).
 */
export function parseMediaItems(
  raw: string | undefined,
  fallback: PortfolioImageItem[]
): PortfolioImageItem[] {
  if (!raw?.trim()) return fallback;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return fallback;
    return fallback.map((fb, i) => {
      const row = parsed[i] as Record<string, unknown> | undefined;
      if (!row || typeof row !== "object") return fb;
      const url =
        typeof row.url === "string" && row.url.trim() ? row.url.trim() : undefined;
      const title = typeof row.title === "string" ? row.title : fb.title;
      const subtitle = typeof row.subtitle === "string" ? row.subtitle : fb.subtitle;
      const acc = row.accent;
      const accent =
        acc === "violet" ||
        acc === "rose" ||
        acc === "amber" ||
        acc === "cyan" ||
        acc === "emerald" ||
        acc === "indigo"
          ? acc
          : fb.accent;
      return { ...fb, title, subtitle, url, accent };
    });
  } catch {
    return fallback;
  }
}
