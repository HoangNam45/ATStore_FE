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
      <div className="group relative h-full cursor-pointer">
        {/* Vintage frame container */}
        <div className="relative h-full bg-gradient-to-br from-amber-100 via-orange-50 to-rose-100 dark:from-amber-900/40 dark:via-orange-900/30 dark:to-rose-900/40 border-8 border-double border-amber-900/30 dark:border-amber-600/40 rounded-sm overflow-hidden shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 dark:shadow-2xl">
          
          {/* Paper texture overlay */}
          <div className="absolute inset-0 opacity-10 dark:opacity-5 mix-blend-multiply pointer-events-none" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" /%3E%3C/svg%3E")'
          }} />

          {/* Image container with vintage Polaroid style */}
          <div className="relative aspect-[3/2] w-full overflow-hidden bg-white/90 dark:bg-slate-700/90 m-3 mb-4 border-4 border-white dark:border-slate-600 shadow-md">
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 50vw, 33vw"
              unoptimized
            />
            {/* Vintage vignette overlay */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/20 opacity-0 group-hover:opacity-60 transition-opacity duration-400" />
          </div>

          {/* Vintage text section */}
          <div className="px-3 pb-4 space-y-2">
            <h3 className="text-center text-xs sm:text-sm font-serif font-semibold text-amber-950 dark:text-amber-100 transition-colors duration-300 group-hover:text-[oklch(0.75_0.15_350)] dark:group-hover:text-pink-300 min-h-10 flex items-center justify-center leading-tight">
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
            
            {/* Vintage decorative line */}
            <div className="flex items-center justify-center gap-2">
              <div className="h-px w-6 bg-gradient-to-r from-transparent to-[oklch(0.75_0.15_350)]" />
              <div className="w-1 h-1 rounded-full bg-[oklch(0.75_0.15_350)]" />
              <div className="h-px w-6 bg-gradient-to-l from-transparent to-[oklch(0.75_0.15_350)]" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
