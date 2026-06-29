import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { FloatingContactBar } from "@/components/site/FloatingContactBar";
import { siteConfig } from "@/data/constants";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://gonhomestay.vercel.app"),
  title: {
    default: "Gon Home | Gôn Home Đà Lạt - Homestay nhà gỗ riêng tư",
    template: "%s | Gon Home Đà Lạt",
  },
  description: "Gon Home (Gôn Home) Đà Lạt - Homestay nguyên căn, nhà gỗ riêng biệt, ấm cúng dành cho gia đình và nhóm bạn tại Đan Kia, Langbiang, Đà Lạt.",
  keywords: [
    "Gon Home",
    "Gôn Home",
    "Gon Home Đà Lạt",
    "Gôn Home Đà Lạt",
    "Gon De Home",
    "Homestay Gon Home",
    "homestay Đà Lạt",
    "homestay nhà gỗ Đà Lạt",
    "homestay Đan Kia Langbiang",
  ],
  openGraph: {
    title: "Gon Home | Gôn Home Đà Lạt",
    description: "Gon Home (Gôn Home) Đà Lạt - Homestay nguyên căn, nhà gỗ riêng biệt, ấm cúng dành cho gia đình và nhóm bạn tại Đan Kia, Langbiang.",
    url: "/",
    siteName: "Gon Home",
    images: [{ url: "/images/homestay/gon-home-hero.jpg", width: 1200, height: 630, alt: "Gon Home Đà Lạt" }],
    locale: "vi_VN",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  "name": "Gon Home",
  "alternateName": "Gôn Home Đà Lạt",
  "image": "https://gonhomestay.vercel.app/images/homestay/gon-home-hero.jpg",
  "description": "Homestay nhà gỗ nguyên căn, yên tĩnh và riêng tư tại khu vực Đan Kia, Langbiang, Đà Lạt. Không gian phù hợp cho gia đình và nhóm bạn với đầy đủ tiện nghi, khu vực BBQ, đậu ô tô.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Đường 17 Đan Kia",
    "addressLocality": "Đà Lạt",
    "addressRegion": "Lâm Đồng",
    "addressCountry": "VN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "12.016335",
    "longitude": "108.406059"
  },
  "url": "https://gonhomestay.vercel.app",
  "telephone": "+84900000000",
  "priceRange": "$$",
  "amenityFeature": [
    {
      "@type": "LocationFeatureSpecification",
      "name": "Free WiFi",
      "value": "True"
    },
    {
      "@type": "LocationFeatureSpecification",
      "name": "BBQ Area",
      "value": "True"
    },
    {
      "@type": "LocationFeatureSpecification",
      "name": "Parking",
      "value": "True"
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SiteHeader />
        <main className="pb-16 md:pb-0">{children}</main>
        <SiteFooter />
        <FloatingContactBar />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
