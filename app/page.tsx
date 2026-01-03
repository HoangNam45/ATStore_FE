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
      <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
        <div className="container mx-auto px-6 py-6 sm:px-12 sm:py-12">
          <div className="mb-6 text-center sm:mb-12">
            <h1 className="text-sm text-gray-600 dark:text-gray-400 sm:text-base">
              <div>Chào mọi người đến với web của tui {"(>_<)"}</div>
              Web tui chủ yếu bán acc reroll như Project Sekai, BanG Dream, Uma
              Musume và nhiều game khác.
            </h1>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 xl:grid-cols-4">
            {games.map((game) => (
              <GameCard
                key={game.id}
                name={game.name}
                slug={game.slug}
                image={game.image}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
