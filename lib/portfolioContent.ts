/** Placeholder portfolio items — URLs optional; set from Admin → Media (stored as JSON in CMS). */

export type ShowcaseThumb = {
  id: string;
  title: string;
  subtitle: string;
};

export type PortfolioItem = ShowcaseThumb & {
  /** Optional accent for gradient placeholder */
  accent?: "violet" | "rose" | "amber" | "cyan" | "emerald" | "indigo";
};

/** Image URL optional; when set, shown instead of gradient placeholder. */
export type PortfolioImageItem = PortfolioItem & {
  url?: string;
};

/** Four thumbnails shown under YouTube packages on the homepage. */
export const youtubePackageShowcase: ShowcaseThumb[] = [
  { id: "yt-1", title: "Long-form explainers", subtitle: "Tech & education" },
  { id: "yt-2", title: "Viral Shorts & hooks", subtitle: "Entertainment" },
  { id: "yt-3", title: "Documentary series", subtitle: "Finance & business" },
  { id: "yt-4", title: "How-to & tutorials", subtitle: "Lifestyle & brands" },
];

const YOUTUBE_SHOWCASE_ACCENTS: Array<NonNullable<PortfolioItem["accent"]>> = [
  "violet",
  "rose",
  "amber",
  "cyan",
];

/** Same slots as `youtubePackageShowcase`, with accents for placeholders / CMS merge. */
export const youtubeShowcaseMediaFallback: PortfolioImageItem[] =
  youtubePackageShowcase.map((item, i) => ({
    ...item,
    accent: YOUTUBE_SHOWCASE_ACCENTS[i % YOUTUBE_SHOWCASE_ACCENTS.length],
  }));

export const portfolioYoutubeItems: PortfolioItem[] = [
  { id: "pyt-1", title: "Channel rebrands", subtitle: "Full visual refresh + strategy", accent: "violet" },
  { id: "pyt-2", title: "Evergreen series", subtitle: "12+ episode runs", accent: "rose" },
  { id: "pyt-3", title: "Launch campaigns", subtitle: "Product & course drops", accent: "amber" },
  { id: "pyt-4", title: "Shorts-first growth", subtitle: "Daily Shorts pipelines", accent: "cyan" },
  { id: "pyt-5", title: "Interview & podcast", subtitle: "Long-form conversations", accent: "emerald" },
  { id: "pyt-6", title: "Thumbnail A/B tests", subtitle: "CTR-led creative", accent: "indigo" },
];

export const portfolioInstagramItems: PortfolioItem[] = [
  { id: "pig-1", title: "Reels & hooks", subtitle: "Trend-led creative", accent: "rose" },
  { id: "pig-2", title: "Carousel education", subtitle: "Slides & saves", accent: "violet" },
  { id: "pig-3", title: "Stories & launches", subtitle: "Campaign bursts", accent: "amber" },
  { id: "pig-4", title: "Community management", subtitle: "Comments & DMs", accent: "cyan" },
  { id: "pig-5", title: "Monthly reporting", subtitle: "Performance packs", accent: "emerald" },
  { id: "pig-6", title: "Brand aesthetics", subtitle: "Grid cohesion", accent: "indigo" },
];

export const portfolioUgcItems: PortfolioItem[] = [
  { id: "pug-1", title: "Meta & Google ads", subtitle: "Creative testing", accent: "violet" },
  { id: "pug-2", title: "UGC creator packs", subtitle: "Authentic testimonials", accent: "rose" },
  { id: "pug-3", title: "Lead magnets", subtitle: "Landing + creative", accent: "amber" },
  { id: "pug-4", title: "Influencer match", subtitle: "Niche partnerships", accent: "cyan" },
  { id: "pug-5", title: "Profile optimization", subtitle: "Bio, links, funnels", accent: "emerald" },
  { id: "pug-6", title: "Campaign strategy", subtitle: "Quarterly roadmaps", accent: "indigo" },
];

const accentClass: Record<NonNullable<PortfolioItem["accent"]>, string> = {
  violet: "from-violet-600/90 to-[#4C1D95]/95",
  rose: "from-rose-600/90 to-pink-900/95",
  amber: "from-amber-600/90 to-orange-900/95",
  cyan: "from-cyan-600/90 to-sky-900/95",
  emerald: "from-emerald-600/90 to-teal-900/95",
  indigo: "from-indigo-600/90 to-[#312E81]/95",
};

export function placeholderGradientClass(accent: PortfolioItem["accent"] = "violet") {
  return accentClass[accent] ?? accentClass.violet;
}
