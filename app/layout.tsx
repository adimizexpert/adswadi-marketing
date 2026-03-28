import type { Metadata } from "next";
import { Poppins } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Adswadi — YouTube Growth & Content Agency",
  description:
    "Scripting, editing, thumbnails — ek complete YouTube growth system. Aap sirf content par focus karo, baaki sab humara kaam.",
  openGraph: {
    title: "Adswadi — YouTube Growth Ka Adda",
    description:
      "Hum aapke YouTube channel ko ek brand mein badalte hain. Scripting, editing aur thumbnails — sab kuch ek hi jagah.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi" className={poppins.variable}>
      <body className="min-h-screen bg-[#F0F4FF] font-sans">
        <MotionProvider>
          <PageLoader />
          <PageTransition>{children}</PageTransition>
        </MotionProvider>
      </body>
    </html>
  );
}
