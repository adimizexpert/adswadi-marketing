import type { Metadata, Viewport } from "next";
import { Outfit, Poppins, Syne } from "next/font/google";
import MotionProvider from "@/components/MotionProvider";
import PageLoader from "@/components/PageLoader";
import PageTransition from "@/components/PageTransition";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

/** Hero brand line — geometric, high impact */
const syne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-syne",
  display: "swap",
});

/** Hero supporting headline — clean pairing */
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Adswadi SMM — YouTube Growth & Content Agency",
  description:
    "Scripting, editing, and thumbnails in one YouTube growth system. You focus on content; we handle the rest.",
  icons: {
    icon: [
      { url: "/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicons/favicon.ico", sizes: "48x48" },
    ],
    apple: "/favicons/apple-touch-icon.png",
  },
  manifest: "/favicons/site.webmanifest",
  appleWebApp: {
    title: "Adswadi SMM",
    statusBarStyle: "default",
  },
  openGraph: {
    title: "Adswadi SMM — YouTube Growth Hub",
    description:
      "We turn your YouTube channel into a brand. Scripting, editing, and thumbnails in one place.",
  },
};

export const viewport: Viewport = {
  themeColor: "#7C3AED",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${syne.variable} ${outfit.variable}`}>
      <body className="min-h-screen bg-[#F0F4FF] font-sans">
        <MotionProvider>
          <PageLoader />
          <PageTransition>{children}</PageTransition>
        </MotionProvider>
      </body>
    </html>
  );
}
