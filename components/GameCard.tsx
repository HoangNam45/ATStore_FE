"use client";

import Image from "next/image";
import Link from "next/link";

interface GameCardProps {
  name: string;
  image: string;
  slug: string;
}

export default function GameCard({ name, image, slug }: GameCardProps) {
  return (
    <Link href={`/games/${slug}`}>
      <div className="group relative h-full cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-br from-white to-pink-50 shadow-lg transition-all duration-500 hover:shadow-2xl hover:scale-105 dark:from-zinc-800 dark:to-zinc-900">
        {/* Decorative glow effect */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[oklch(0.75_0.15_350)] via-transparent to-[oklch(0.65_0.18_320)] opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-xl -z-10" />
        
        <div className="relative aspect-[3/2] w-full overflow-hidden rounded-xl">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-125 group-hover:rotate-1"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 50vw, 33vw"
            unoptimized
          />
          {/* Multi-layer gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent via-30% to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.75_0.15_350)]/0 to-[oklch(0.75_0.15_350)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Enhanced text section */}
        <div className="relative p-3 sm:p-4">
          <h3 className="text-center text-xs sm:text-sm font-bold bg-gradient-to-r from-[oklch(0.2_0.02_280)] via-[oklch(0.75_0.15_350)] to-[oklch(0.2_0.02_280)] bg-clip-text text-transparent dark:from-pink-200 dark:via-[oklch(0.75_0.15_350)] dark:to-pink-200 transition-all duration-300 group-hover:text-[oklch(0.75_0.15_350)] dark:group-hover:text-white min-h-10 flex items-center justify-center">
            <span
              className="block text-balance"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {name}
            </span>
          </h3>
          
          {/* Accent line */}
          <div className="mt-2 h-0.5 w-0 mx-auto bg-gradient-to-r from-transparent via-[oklch(0.75_0.15_350)] to-transparent group-hover:w-12 transition-all duration-500" />
        </div>
      </div>
    </Link>
  );
}
