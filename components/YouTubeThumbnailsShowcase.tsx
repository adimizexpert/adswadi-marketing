"use client";

import Image from "next/image";
import { Youtube } from "lucide-react";
import {
  placeholderGradientClass,
  type PortfolioImageItem,
} from "@/lib/portfolioContent";

type Props = {
  items: PortfolioImageItem[];
};

export default function YouTubeThumbnailsShowcase({ items }: Props) {
  return (
    <section
      id="youtube-showcase"
      className="scroll-mt-24 border-t border-purple-100/80 bg-gradient-to-b from-white to-[#FAF5FF]/80 py-10 sm:py-12"
      aria-labelledby="youtube-showcase-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#7C3AED]/80">
              Sample work
            </p>
            <h2
              id="youtube-showcase-heading"
              className="mt-1 text-lg font-bold text-gray-900 sm:text-xl"
            >
              YouTube thumbnail style
            </h2>
            <p className="mt-1 max-w-xl text-sm text-gray-600">
              Four directions we use for CTR and brand fit. Replace with your real frames anytime.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
            <Youtube className="h-3.5 w-3.5" aria-hidden />
            YouTube
          </span>
        </div>

        <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {items.map((item) => (
            <li key={item.id}>
              <figure className="group overflow-hidden rounded-xl border border-gray-200/90 bg-white shadow-sm ring-1 ring-gray-100/80">
                <div
                  className={`relative aspect-video bg-gradient-to-br ${placeholderGradientClass(
                    item.accent
                  )}`}
                >
                  {item.url ? (
                    <Image
                      src={item.url}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                      unoptimized
                    />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.12),transparent_55%)]" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-40 transition group-hover:opacity-25">
                        <Youtube className="h-10 w-10 text-white/90 sm:h-12 sm:w-12" aria-hidden />
                      </div>
                    </>
                  )}
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-3 pb-3 pt-10 sm:px-3.5 sm:pb-3.5">
                    <p className="text-xs font-semibold text-white sm:text-sm">{item.title}</p>
                    <p className="mt-0.5 text-[11px] text-white/85 sm:text-xs">{item.subtitle}</p>
                  </figcaption>
                </div>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
