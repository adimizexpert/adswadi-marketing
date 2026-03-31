import { Suspense } from "react";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StickyWhatsApp from "@/components/StickyWhatsApp";
import PaymentPageClient from "@/app/payment/PaymentPageClient";
import { getContent } from "@/lib/api";
import { defaultContent } from "@/lib/cmsDefaults";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Pay with UPI — Adswadi SMM",
  description:
    "Pay via UPI using QR or your preferred app. Send the payment screenshot on WhatsApp to confirm.",
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

export default async function PaymentPage() {
  const content = await loadContent();
  const wa = buildWhatsAppUrl(content.whatsapp_number);

  return (
    <>
      <Navbar whatsappUrl={wa} />
      <main className="pb-6 md:pb-8">
        <Suspense
          fallback={
            <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 pt-24 text-gray-600">
              Loading…
            </div>
          }
        >
          <PaymentPageClient />
        </Suspense>
      </main>
      <Footer tagline={content.footer_tagline} whatsappUrl={wa} />
      <StickyWhatsApp whatsappUrl={wa} />
    </>
  );
}
