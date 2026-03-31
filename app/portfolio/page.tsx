import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StickyWhatsApp from "@/components/StickyWhatsApp";
import PortfolioPageView from "@/components/PortfolioPageView";
import { getContent } from "@/lib/api";
import { defaultContent } from "@/lib/cmsDefaults";
import { CMS_MEDIA_KEYS, parseMediaItems } from "@/lib/mediaCms";
import {
  portfolioInstagramItems,
  portfolioUgcItems,
  portfolioYoutubeItems,
} from "@/lib/portfolioContent";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Portfolio — Adswadi SMM",
  description:
    "YouTube, Instagram, and UGC sample work from Adswadi SMM — scripts, thumbnails, and performance creative.",
};

async function loadContent() {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) {
    return defaultContent;
  }
  try {
    const content = await getContent();
    return { ...defaultContent, ...content };
  } catch {
    return defaultContent;
  }
}

export default async function PortfolioPage() {
  const content = await loadContent();
  const wa = buildWhatsAppUrl(content.whatsapp_number);
  const portfolioYoutube = parseMediaItems(
    content[CMS_MEDIA_KEYS.portfolioYoutube],
    portfolioYoutubeItems
  );
  const portfolioInstagram = parseMediaItems(
    content[CMS_MEDIA_KEYS.portfolioInstagram],
    portfolioInstagramItems
  );
  const portfolioUgc = parseMediaItems(
    content[CMS_MEDIA_KEYS.portfolioUgc],
    portfolioUgcItems
  );

  return (
    <>
      <Navbar whatsappUrl={wa} />
      <main className="pb-6 md:pb-8">
        <PortfolioPageView
          portfolioYoutube={portfolioYoutube}
          portfolioInstagram={portfolioInstagram}
          portfolioUgc={portfolioUgc}
        />
        <Footer tagline={content.footer_tagline} whatsappUrl={wa} />
      </main>
      <StickyWhatsApp whatsappUrl={wa} />
    </>
  );
}
