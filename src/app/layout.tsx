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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default:
      "Gôn Home Đà Lạt - Homestay nhà gỗ riêng biệt tại Đan Kia Langbiang",
    template: "%s | Gôn Home Đà Lạt",
  },
  description: siteConfig.description,
  keywords: [
    "Gôn Home Đà Lạt",
    "homestay Đà Lạt",
    "homestay nhà gỗ Đà Lạt",
    "homestay Đà Lạt 2 phòng ngủ",
    "homestay Đà Lạt cho nhóm 5 người",
    "homestay Đà Lạt có BBQ",
    "homestay Đà Lạt có chỗ đậu ô tô",
    "homestay Đan Kia Langbiang",
    "Gôn Home đường 17 Đan Kia",
  ],
  openGraph: {
    title: "Gôn Home Đà Lạt",
    description: siteConfig.description,
    url: "/",
    siteName: "Gôn Home Đà Lạt",
    images: [{ url: "/images/homestay/gon-home-hero.jpg", width: 1200, height: 630 }],
    locale: "vi_VN",
    type: "website",
  },
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
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <FloatingContactBar />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
