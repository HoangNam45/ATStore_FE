"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className=" bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="container mx-auto px-4 pt-8">
        <ol className="flex items-center gap-2 text-sm">
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 text-zinc-400 dark:text-zinc-600" />
              )}
              {item.href && !item.active ? (
                <Link
                  href={item.href}
                  className="text-zinc-600 transition-colors hover:text-[oklch(0.75_0.15_350)] dark:text-zinc-400 dark:hover:text-[oklch(0.75_0.15_350)]"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={`${
                    item.active
                      ? "font-semibold text-[oklch(0.75_0.15_350)]"
                      : "text-zinc-600 dark:text-zinc-400"
                  }`}
                >
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
