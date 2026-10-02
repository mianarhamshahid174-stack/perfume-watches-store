import type { Metadata } from "next";
import { Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GlobalStructuredData } from "@/components/seo/structured-data";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://velora-ateliers.com"),
  title: {
    template: "%s | VELORA Haute Horlogerie & High Perfumery",
    default: "VELORA | Haute Horlogerie & High Perfumery Geneva",
  },
  description:
    "Explore VELORA: Precision mechanical timepieces and bespoke artisanal extraits de parfum crafted with uncompromised artistry between Geneva and Grasse.",
  keywords: [
    "VELORA",
    "Luxury Watches",
    "Haute Horlogerie",
    "Niche Perfumery",
    "Artisanal Fragrance",
    "Mechanical Timepieces",
    "Chronograph",
    "Tourbillon",
    "Swiss Watches",
    "Geneva Atelier",
  ],
  authors: [{ name: "VELORA Ateliers" }],
  openGraph: {
    title: "VELORA | Haute Horlogerie & High Perfumery",
    description:
      "Precision mechanical timepieces and bespoke artisanal fragrances crafted with uncompromised artistry.",
    type: "website",
    locale: "en_US",
    images: [{ url: "/images/velora-hero-editorial.jpg", width: 1200, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-obsidian text-sand-100 selection:bg-gold-500/30 selection:text-gold-300">
        <GlobalStructuredData />
        {children}
      </body>
    </html>
  );
}
