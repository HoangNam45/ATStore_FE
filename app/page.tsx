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
      <div className="relative min-h-screen bg-gradient-to-b from-zinc-50 via-pink-50/30 to-white font-sans dark:from-black dark:via-zinc-900 dark:to-black overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[oklch(0.75_0.15_350)]/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-1/3 left-0 w-96 h-96 bg-[oklch(0.65_0.18_320)]/5 rounded-full blur-3xl -z-10" />

        <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          {/* Header Section */}
          <div className="mb-12 sm:mb-16 text-center space-y-4">
            <div className="inline-block">
              <span className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-[oklch(0.75_0.15_350)] via-[oklch(0.65_0.18_320)] to-[oklch(0.75_0.15_350)] bg-clip-text text-transparent">
                ATStore
              </span>
            </div>
            
            <h1 className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 space-y-2">
              <div className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100">
                Chào mọi người đến với web của tui 💕
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                Nơi bán những tài khoản reroll chất lượng cao cho các game yêu thích
              </p>
            </h1>

            {/* Decorative divider */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-[oklch(0.75_0.15_350)]" />
              <div className="w-2 h-2 rounded-full bg-[oklch(0.75_0.15_350)]" />
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-[oklch(0.75_0.15_350)]" />
            </div>
          </div>

          {/* Games Grid - Responsive for all devices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 auto-rows-max">
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

          {/* Footer Message */}
          <div className="mt-12 sm:mt-16 text-center">
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              ✨ Các tài khoản được kiểm tra kỹ lưỡng và đảm bảo an toàn ✨
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
