import type { Metadata } from "next";
import { Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GlobalStructuredData } from "@/components/seo/structured-data";
import { ThemeProvider } from "@/context/theme-context";
import { FirebaseAnalyticsProvider } from "@/components/providers/firebase-analytics";

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
  metadataBase: new URL("https://velora.pk"),
  title: {
    template: "%s | VELORA Pakistan - Luxury Watches & Fine Fragrances",
    default: "VELORA Pakistan | Luxury Watches & Fine Fragrances",
  },
  description:
    "Discover VELORA Pakistan: Curated luxury automatic timepieces and artisanal fine fragrances. Nationwide express delivery with Cash on Delivery and official 5-year warranty.",
  keywords: [
    "VELORA Pakistan",
    "Luxury Watches Pakistan",
    "Men Watches Pakistan",
    "Perfumes Pakistan",
    "Cash on Delivery Watches Pakistan",
    "Automatic Watches Lahore",
    "Luxury Perfumes Karachi",
    "VELORA Islamabad",
  ],
  authors: [{ name: "VELORA Pakistan" }],
  openGraph: {
    title: "VELORA Pakistan | Luxury Watches & Fine Fragrances",
    description:
      "Curated luxury automatic timepieces and artisanal fine fragrances with nationwide delivery across Pakistan.",
    type: "website",
    locale: "en_PK",
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
      suppressHydrationWarning
      data-theme="dark"
      className={`${cormorant.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-obsidian text-sand-100 selection:bg-gold-500/30 selection:text-gold-300">
        <ThemeProvider>
          <FirebaseAnalyticsProvider />
          <GlobalStructuredData />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
