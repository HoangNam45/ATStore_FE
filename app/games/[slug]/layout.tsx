import type { Metadata, Viewport } from "next";
import { games } from "@/data/games";

const baseUrl = "https://qtat.website";

interface Props {
  params: Promise<{ slug: string }>;
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 0.8,
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const game = games.find((g) => g.slug === slug);

  if (!game) {
    return {
      title: "Không Tìm Thấy Game",
      description: "Trang bạn đang tìm không tồn tại.",
    };
  }

  const gameUrl = `${baseUrl}/games/${slug}`;
  const description = `Mua bán tài khoản reroll ${game.name}.`;

  return {
    title: `Mua Bán Tài Khoản Reroll ${game.name}`,
    description,
    keywords: [
      `tài khoản ${game.name}`,
      `mua acc ${game.name}`,
      `bán acc ${game.name}`,
      `${game.name} giá rẻ`,
      "tài khoản game",
    ],
    openGraph: {
      title: `Tài Khoản ${game.name} - ATStore`,
      description,
      url: gameUrl,
      type: "website",
      images: [
        {
          url: game.image.startsWith("http")
            ? game.image
            : `${baseUrl}${game.image}`,
          width: 1200,
          height: 630,
          alt: `Tài Khoản ${game.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Tài Khoản ${game.name} - ATStore`,
      description,
      images: [
        game.image.startsWith("http") ? game.image : `${baseUrl}${game.image}`,
      ],
    },
    alternates: {
      canonical: gameUrl,
    },
  };
}

export function generateStaticParams() {
  return games.map((game) => ({
    slug: game.slug,
  }));
}

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
