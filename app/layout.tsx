import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Header } from "@/components/Layout/Header/Header";
import { SakuraPetals } from "@/components/Theme/sakura-petals";
import { Footer } from "@/components/Layout/Footer/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://qtat.website";

export const metadata: Metadata = {
  title: {
    default: "ATStore - Mua Bán Acc Reroll",
    template: "%s | ATStore",
  },
  description:
    "Web chủ yếu bán acc reroll như Project Sekai, BanG Dream, Uma Musume và nhiều game khác.",
  keywords: [
    "mua tài khoản reroll",
    "bán tài khoản reroll",
    "acc game",
    "acc reroll giá rẻ",
    "mua bán acc reroll",
    "ATStore",
  ],
  authors: [{ name: "ATStore" }],
  creator: "ATStore",
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: baseUrl,
    siteName: "ATStore",
    title: "ATStore - Mua Bán Account Reroll",
    description:
      "Web chủ yếu bán acc reroll như Project Sekai, BanG Dream, Uma Musume và nhiều game khác.",
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "ATStore - Mua Bán Tài Khoản Game",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ATStore - Mua Bán Account Reroll",
    description: "Mua bán acc reroll uy tín, an toàn.",
    images: [`${baseUrl}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <AuthProvider>
            <SakuraPetals />
            <Header />
            {children}
            <Footer />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
