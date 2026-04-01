import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PlansSection from "@/components/PlansSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import StickyWhatsApp from "@/components/StickyWhatsApp";
import {
  YouTubePlatformSection,
  InstagramPlatformSection,
  UGCPlatformSection,
} from "@/components/PlatformSections";
import YouTubeThumbnailsShowcase from "@/components/YouTubeThumbnailsShowcase";
import { getContent, getPlans } from "@/lib/api";
import { defaultContent, defaultPlans } from "@/lib/cmsDefaults";
import { splitPlansByPlatform } from "@/lib/plansSplit";
import { CMS_MEDIA_KEYS, parseMediaItems } from "@/lib/mediaCms";
import { youtubeShowcaseMediaFallback } from "@/lib/portfolioContent";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

async function loadCms() {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) {
    return {
      plans: defaultPlans,
      content: defaultContent,
    };
  }
  try {
    const [plans, content] = await Promise.all([getPlans(), getContent()]);
    return {
      plans: plans.length ? plans : defaultPlans,
      content: { ...defaultContent, ...content },
    };
  } catch {
    return {
      plans: defaultPlans,
      content: defaultContent,
    };
  }
}

export default async function Home() {
  const { plans, content } = await loadCms();
  const { youtube: youtubePlans, instagram: instagramPlans } =
    splitPlansByPlatform(plans);
  const wa = buildWhatsAppUrl(content.whatsapp_number);
  const youtubeShowcaseItems = parseMediaItems(
    content[CMS_MEDIA_KEYS.youtubeShowcase],
    youtubeShowcaseMediaFallback
  );

  return (
    <>
      <Navbar whatsappUrl={wa} />
      <main className="pb-6 md:pb-8">
        <Hero
          line1={content.hero_headline_line1}
          line2={content.hero_headline_line2}
          subheadline={content.hero_subheadline}
          subtextLine2={content.hero_subtext_line2}
        />
        <YouTubePlatformSection />
        <PlansSection
          sectionId="youtube-plans"
          plans={youtubePlans}
          heading="YouTube packages"
          subheading="Pick a tier that matches your upload volume and support level."
        />
        <YouTubeThumbnailsShowcase items={youtubeShowcaseItems} />
        <InstagramPlatformSection />
        <PlansSection
          sectionId="instagram-plans"
          plans={instagramPlans}
          heading="Instagram packages"
          subheading="Same transparent structure tailored for Instagram execution and reporting."
        />
        <UGCPlatformSection whatsappUrl={wa} />
        <CTASection
          headline={content.cta_section_headline}
          subtext={content.cta_section_subtext}
          whatsappUrl={wa}
        />
        <Footer tagline={content.footer_tagline} whatsappUrl={wa} />
      </main>
      <StickyWhatsApp whatsappUrl={wa} />
    </>
  );
}
