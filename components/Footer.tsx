import Link from "next/link";
import { Instagram, Youtube } from "lucide-react";
import BrandLogoVideo from "@/components/BrandLogoVideo";
import WhatsAppLogo from "@/components/WhatsAppLogo";
import {
  SOCIAL_INSTAGRAM,
  SOCIAL_YOUTUBE,
} from "@/lib/constants";

const footerLinks: {
  label: string;
  href: string;
  external?: boolean;
}[] = [
  { label: "Home", href: "/" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "YouTube", href: "/#youtube" },
  { label: "Instagram", href: "/#instagram" },
  { label: "UGC", href: "/#ugc" },
  { label: "Contact", href: "/#contact" },
  {
    label: "Privacy Policy",
    href: "https://adswadi.com/privacy-policy",
    external: true,
  },
  {
    label: "Refund Policy",
    href: "https://adswadi.com/refund-policy",
    external: true,
  },
];

export default function Footer({
  tagline,
  whatsappUrl,
}: {
  tagline: string;
  whatsappUrl: string;
}) {
  return (
    <footer className="bg-[#1e1b4b] text-white">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:justify-between">
          <div className="text-center md:text-left">
            <div className="flex justify-center md:justify-start">
              <BrandLogoVideo variant="footer" />
            </div>
            <p className="mt-3 text-sm text-white/75">{tagline}</p>
          </div>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium text-white/90">
              {footerLinks.map((l) => (
                <li key={l.href}>
                  {l.external ? (
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white"
                    >
                      {l.label}
                    </a>
                  ) : (
                    <Link href={l.href} className="hover:text-white">
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-4">
            <a
              href={SOCIAL_YOUTUBE}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white/10 p-2.5 transition-colors hover:bg-white/20"
              aria-label="Adswadi on YouTube"
            >
              <Youtube className="h-5 w-5" />
            </a>
            <a
              href={SOCIAL_INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white/10 p-2.5 transition-colors hover:bg-white/20"
              aria-label="Adswadi on Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#25D366] p-2.5 text-white transition-colors hover:bg-[#20BD5A]"
              aria-label="WhatsApp"
            >
              <WhatsAppLogo className="h-5 w-5" />
            </a>
          </div>
        </div>
        <div className="mt-12 border-t border-white/10 pt-8 text-center text-xs text-white/60 sm:text-sm">
          © 2026 Adswadi SMM. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
