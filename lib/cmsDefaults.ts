import type { CmsPlan, CmsService, SiteContentMap } from "./api";

export const defaultContent: SiteContentMap = {
  hero_headline_line1: "Adswadi SSM",
  hero_headline_line2: "Social media management — YouTube first. Instagram and UGC.",
  hero_subheadline:
    "Scripting, CTR thumbnails, editing, AI video, and trend-led YouTube growth.",
  hero_subtext_line2:
    "Then Instagram management and UGC. Pricing sits at the end of each platform section.",
  whatsapp_number: "91XXXXXXXXXX",
  cta_section_headline: "Ready to talk through your stack?",
  cta_section_subtext:
    "Book a free consultation on WhatsApp. We align scope and pricing on a short call.",
  footer_tagline: "YouTube, Instagram, and UGC under one roof.",
};

export const defaultPlans: CmsPlan[] = [
  {
    id: 1,
    name: "silver",
    label: "Starter Pack",
    price: 9999,
    badge: null,
    features: [
      "4 Long Videos / Month",
      "Basic Research & Scripting",
      "Standard Cuts & Subtitles",
      "4 Thumbnail Designs",
      "Email Support",
    ],
    cta_text: "Start with Silver",
  },
  {
    id: 2,
    name: "gold",
    label: "Growth Pack",
    price: 18999,
    badge: "Most Popular",
    features: [
      "8 Long Videos / Month",
      "Deep Storytelling Scripts",
      "Premium Motion Graphics",
      "8 Thumbnails + A/B Testing",
      "Priority WhatsApp Support",
    ],
    cta_text: "Choose Gold",
  },
  {
    id: 3,
    name: "diamond",
    label: "Diamond Pack",
    price: 29999,
    badge: null,
    features: [
      "12 Long + 10 Shorts / Month",
      "Viral Hooks + Growth Strategy",
      "Netflix-Style Documentary Editing",
      "Unlimited Thumbnail Revisions",
      "Personal Brand Consultant",
    ],
    cta_text: "Get Diamond",
  },
];

export const defaultServices: CmsService[] = [
  {
    id: 1,
    icon: "filetext",
    title: "High-Retention Scripting",
    description:
      "Psychology-based storytelling that keeps viewers watching. Deep research, viral hooks, and a full emotional arc included.",
    sort_order: 0,
  },
  {
    id: 2,
    icon: "clapperboard",
    title: "Premium Video Editing",
    description:
      "From documentary-style long edits to viral Shorts. Motion graphics, color grading, and captions at a premium level.",
    sort_order: 1,
  },
  {
    id: 3,
    icon: "image",
    title: "High-CTR Thumbnails",
    description:
      "Designs built to stop the scroll and earn clicks. A/B tested, data-backed, and on-brand.",
    sort_order: 2,
  },
];
