import GameCard from "@/components/GameCard";
import { games } from "@/data/games";
import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://atstore.com";

export const metadata: Metadata = {
  title: "Trang Chủ - Mua Bán Tài Khoản Game",
  description:
    "Khám phá hàng nghìn tài khoản game chất lượng từ các tựa game hot như Project Sekai, BanG Dream, Uma Musume và nhiều game khác. Giá tốt, giao dịch an toàn.",
  openGraph: {
    title: "ATStore - Mua Bán Tài Khoản Game Uy Tín",
    description:
      "Khám phá hàng nghìn tài khoản game chất lượng với giá tốt nhất thị trường.",
    url: baseUrl,
    type: "website",
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "ATStore - Tài Khoản Game",
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
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    description: "Sàn giao dịch mua bán tài khoản game uy tín và an toàn",
    image: `${baseUrl}/og-image.png`,
    publisher: {
      "@type": "Organization",
      name: "ATStore",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
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
            <h1 className="text-3xl font-bold mb-3 sm:text-4xl">
              Mua Bán Tài Khoản Game Uy Tín
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-400 sm:text-lg">
              Giao dịch an toàn - Giá tốt nhất - Hỗ trợ 24/7
            </p>
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
