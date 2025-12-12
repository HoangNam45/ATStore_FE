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
      <div className="group relative overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-2 dark:bg-zinc-900">
        <div className="relative aspect-[3/2] w-full overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
        <div className="p-3">
          <h3 className="text-center text-xs font-semibold text-zinc-800 transition-colors group-hover:text-[oklch(0.75_0.15_350)] dark:text-zinc-200 dark:group-hover:text-[oklch(0.75_0.15_350)]">
            {name}
          </h3>
        </div>
      </div>
    </Link>
  );
}
