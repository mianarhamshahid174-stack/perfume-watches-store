import type { Metadata } from "next";
import { Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
  title: {
    template: "%s | ZAVEN Haute Horlogerie & Parfum",
    default: "ZAVEN | Haute Horlogerie & High Perfumery",
  },
  description:
    "Explore ZAVEN: Precision mechanical timepieces and bespoke artisanal fragrances crafted with uncompromised artistry.",
  keywords: [
    "ZAVEN",
    "Luxury Watches",
    "Haute Horlogerie",
    "Niche Perfumery",
    "Artisanal Fragrance",
    "Mechanical Timepieces",
    "Chronograph",
    "Tourbillon",
  ],
  authors: [{ name: "ZAVEN Ateliers" }],
  openGraph: {
    title: "ZAVEN | Haute Horlogerie & High Perfumery",
    description:
      "Precision mechanical timepieces and bespoke artisanal fragrances crafted with uncompromised artistry.",
    type: "website",
    locale: "en_US",
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
        {children}
      </body>
    </html>
  );
}
