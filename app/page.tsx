import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProblemSection from "@/components/ProblemSection";
import ServicesSection from "@/components/ServicesSection";
import PlansSection from "@/components/PlansSection";
import WhyUs from "@/components/WhyUs";
import ProcessSection from "@/components/ProcessSection";
import Portfolio from "@/components/Portfolio";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import StickyWhatsApp from "@/components/StickyWhatsApp";
import { getContent, getPlans, getServices } from "@/lib/api";
import {
  defaultContent,
  defaultPlans,
  defaultServices,
} from "@/lib/cmsDefaults";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

async function loadCms() {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) {
    return {
      plans: defaultPlans,
      content: defaultContent,
      services: defaultServices,
    };
  }
  try {
    const [plans, content, services] = await Promise.all([
      getPlans(),
      getContent(),
      getServices(),
    ]);
    return {
      plans: plans.length ? plans : defaultPlans,
      content: { ...defaultContent, ...content },
      services: services.length ? services : defaultServices,
    };
  } catch {
    return {
      plans: defaultPlans,
      content: defaultContent,
      services: defaultServices,
    };
  }
}

export default async function Home() {
  const { plans, content, services } = await loadCms();
  const wa = buildWhatsAppUrl(content.whatsapp_number);

  return (
    <>
      <Navbar whatsappUrl={wa} />
      <main className="pb-24 md:pb-0">
        <Hero
          line1={content.hero_headline_line1}
          line2={content.hero_headline_line2}
          subheadline={content.hero_subheadline}
          subtextLine2={content.hero_subtext_line2}
          whatsappUrl={wa}
        />
        <ProblemSection />
        <ServicesSection services={services} />
        <PlansSection plans={plans} />
        <WhyUs />
        <ProcessSection />
        <Portfolio />
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
