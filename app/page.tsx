import GameCard from "@/components/GameCard";
import { games } from "@/data/games";
import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://qtat.website";

export const metadata: Metadata = {
  title: "QTAT - Mua Bán Tài Khoản Reroll",
  description:
    "Tui bán nhiều account reroll như Project Sekai, BanG Dream, Uma Musume và nhiều game khác.",
  openGraph: {
    title: "QTAT - Mua Bán Tài Khoản Reroll",
    description:
      "Tui bán nhiều account reroll như Project Sekai, BanG Dream, Uma Musume và nhiều game khác.",
    url: baseUrl,
    type: "website",
    images: [
      {
        url: `${baseUrl}/images/games/pjsk.jfif`,
        width: 1200,
        height: 630,
        alt: "QTAT - Tài Khoản Reroll",
      },
    ],
  },
  alternates: {
    canonical: baseUrl,
  },
};

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ATStore",
    url: baseUrl,
    description:
      "Sàn giao dịch mua bán tài khoản game reroll uy tín và an toàn",
    image: `${baseUrl}/images/games/pjsk.jfif`,
    publisher: {
      "@type": "Organization",
      name: "ATStore",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/images/games/pjsk.jfif`,
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="relative min-h-screen bg-gradient-to-b from-amber-50 via-orange-50/50 to-rose-50 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-rose-950/30 font-serif overflow-hidden">
        {/* Vintage paper texture */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none -z-10" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="paper"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.4" numOctaves="5" result="noise" /%3E%3CfeDisplacementMap in="SourceGraphic" in2="noise" scale="30" /%3E%3C/filter%3E%3Crect width="200" height="200" filter="url(%23paper)" fill="black" /%3E%3C/svg%3E")'
        }} />

        <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          {/* Vintage Header Section */}
          <div className="mb-12 sm:mb-16 text-center space-y-6">
            {/* Decorative vintage frame */}
            <div className="inline-block mx-auto">
              <div className="border-4 border-double border-amber-900/40 dark:border-amber-600/40 px-8 py-6 bg-gradient-to-b from-amber-100/60 to-rose-100/40 dark:from-amber-900/20 dark:to-rose-900/20">
                <span className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-amber-950 dark:text-amber-100 tracking-widest">
                  AT STORE
                </span>
              </div>
            </div>
            
            <h1 className="space-y-3">
              <div className="text-base sm:text-lg md:text-xl font-serif font-semibold text-amber-900 dark:text-amber-100 tracking-wide">
                Chào mọi người đến với web của tui
              </div>
              <p className="text-sm sm:text-base text-amber-800 dark:text-amber-200 font-serif leading-relaxed max-w-2xl mx-auto">
                Nơi bán những tài khoản reroll chất lượng cao cho các game yêu thích của bạn
              </p>
            </h1>

            {/* Vintage ornamental divider */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[oklch(0.75_0.15_350)]" />
              <span className="text-amber-900 dark:text-amber-200 text-lg">✦</span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[oklch(0.75_0.15_350)]" />
            </div>
          </div>

          {/* Games Grid - Responsive for all devices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 auto-rows-max">
            {games.map((game) => (
              <div key={game.id} className="h-full">
                <GameCard
                  name={game.name}
                  slug={game.slug}
                  image={game.image}
                />
              </div>
            ))}
          </div>

          {/* Vintage Footer Message */}
          <div className="mt-12 sm:mt-16 text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-amber-900 dark:text-amber-200">
              <span>✦</span>
              <p className="text-xs sm:text-sm font-serif italic">
                Các tài khoản được kiểm tra kỹ lưỡng và đảm bảo an toàn
              </p>
              <span>✦</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
