import type { ComponentType } from "react";
import Image from "next/image";
import { Instagram, Sparkles, Youtube } from "lucide-react";
import {
  placeholderGradientClass,
  type PortfolioImageItem,
} from "@/lib/portfolioContent";

function PortfolioCard({ item }: { item: PortfolioImageItem }) {
  const grad = placeholderGradientClass(item.accent);
  return (
    <article className="group overflow-hidden rounded-2xl border border-purple-100/80 bg-white shadow-card ring-1 ring-purple-50/50">
      <div className={`relative aspect-video bg-gradient-to-br ${grad}`}>
        {item.url ? (
          <Image
            src={item.url}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 50vw, 33vw"
            unoptimized
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.14),transparent_55%)]" />
            <div className="absolute inset-0 flex items-center justify-center opacity-35 transition group-hover:opacity-20">
              <span className="rounded-md bg-white/15 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white/95 ring-1 ring-white/20">
                Sample
              </span>
            </div>
          </>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/88 via-black/45 to-transparent px-4 pb-4 pt-16">
          <h3 className="text-sm font-bold text-white sm:text-base">{item.title}</h3>
          <p className="mt-1 text-xs text-white/85 sm:text-sm">{item.subtitle}</p>
        </div>
      </div>
    </article>
  );
}

function SectionHeader({
  id,
  badgeLabel,
  heading,
  description,
  icon: Icon,
  iconClass,
  badgeBg,
}: {
  id: string;
  badgeLabel: string;
  heading: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  iconClass: string;
  badgeBg: string;
}) {
  const headingId = `${id}-heading`;
  return (
    <header id={id} className="scroll-mt-24">
      <span
        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${badgeBg}`}
      >
        <Icon className={`h-4 w-4 ${iconClass}`} aria-hidden />
        {badgeLabel}
      </span>
      <h2
        id={headingId}
        className="mt-3 text-2xl font-extrabold text-[#7C3AED] sm:text-3xl"
      >
        {heading}
      </h2>
      <p className="mt-2 max-w-2xl text-base text-gray-600 sm:text-lg">{description}</p>
    </header>
  );
}

type Props = {
  portfolioYoutube: PortfolioImageItem[];
  portfolioInstagram: PortfolioImageItem[];
  portfolioUgc: PortfolioImageItem[];
};

export default function PortfolioPageView({
  portfolioYoutube,
  portfolioInstagram,
  portfolioUgc,
}: Props) {
  return (
    <div className="bg-gradient-to-b from-[#F0F4FF] to-white pb-20 pt-24 sm:pt-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#7C3AED]/80">
            Portfolio
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
            Work across YouTube, Instagram, and UGC
          </h1>
          <p className="mt-4 text-base text-gray-600 sm:text-lg">
            A sample of formats and programs we run. Swap in real thumbnails and case studies when
            you are ready.
          </p>
        </div>

        <section className="mt-16 space-y-4" aria-labelledby="youtube-portfolio-heading">
          <SectionHeader
            id="youtube-portfolio"
            badgeLabel="YouTube"
            heading="YouTube portfolio"
            description="Long-form, Shorts, and growth systems for creators and brands."
            icon={Youtube}
            iconClass="text-red-600"
            badgeBg="border-red-200 bg-red-50 text-red-800"
          />
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {portfolioYoutube.map((item) => (
              <li key={item.id}>
                <PortfolioCard item={item} />
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-20 space-y-4" aria-labelledby="instagram-portfolio-heading">
          <SectionHeader
            id="instagram-portfolio"
            badgeLabel="Instagram"
            heading="Instagram portfolio"
            description="Reels, carousels, stories, and community rhythm for the feed."
            icon={Instagram}
            iconClass="text-pink-600"
            badgeBg="border-pink-200 bg-pink-50 text-pink-800"
          />
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {portfolioInstagram.map((item) => (
              <li key={item.id}>
                <PortfolioCard item={item} />
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-20 space-y-4" aria-labelledby="ugc-portfolio-heading">
          <SectionHeader
            id="ugc-portfolio"
            badgeLabel="UGC"
            heading="UGC & paid social"
            description="Ads, creators, and funnel creative for performance brands."
            icon={Sparkles}
            iconClass="text-indigo-600"
            badgeBg="border-indigo-200 bg-indigo-50 text-indigo-900"
          />
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {portfolioUgc.map((item) => (
              <li key={item.id}>
                <PortfolioCard item={item} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
