"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { accountService } from "@/services/account.service";
import { games } from "@/data/games";
import { Account } from "@/types/account.types";
import Breadcrumb from "@/components/Breadcrumb";

export default function GamePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const game = games.find((g) => g.slug === slug);

  const { data: accounts = [], error } = useQuery<Account[]>({
    queryKey: ["accounts", slug],
    queryFn: async () => {
      const response = await accountService.getAccountsByGame(slug);
      const data = response.data || response;
      return Array.isArray(data) ? data : [];
    },
    enabled: !!slug,
  });

  const handleAccountClick = (accountId: string) => {
    router.push(`/games/${slug}/${accountId}`);
  };

  if (!game) {
    return (
      <div className="min-h-screen bg-zinc-50 py-12 dark:bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-zinc-800 dark:text-white">
              Game không tồn tại
            </h1>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-50 py-12 dark:bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-500">Không thể tải danh sách account</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Breadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: game.name, active: true },
        ]}
      />
      <div className="container mx-auto px-4 py-3">
        {/* Game Header with Image */}
        <div className="mb-8 flex items-center gap-4 md:gap-6">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg shadow-md md:h-20 md:w-20">
            <Image
              src={game.image}
              alt={game.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 64px, 96px"
              unoptimized
            />
          </div>
          <h1 className="text-2xl font-bold text-zinc-800 dark:text-white md:text-3xl lg:text-3xl">
            {game.name}
          </h1>
        </div>

        {accounts.length === 0 ? (
          <div className="text-center">
            <p className="text-zinc-600 dark:text-zinc-400">
              Chưa có account nào cho game này
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {accounts.map((account) => (
              <button
                key={account.id}
                onClick={() => handleAccountClick(account.id)}
                className="overflow-hidden rounded-lg bg-white text-left shadow-md transition-shadow hover:shadow-lg dark:bg-zinc-900"
              >
                <div className="relative aspect-3/2 w-full">
                  <Image
                    src={account.displayImage}
                    alt={account.type}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <div className="p-4 pb-2">
                  <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">
                    ({account.server}) {account.type}
                  </h3>

                  <div className="mt-3 space-y-2">
                    <div>
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">
                        {game.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-base text-zinc-800">
                        Sẵn có: {account.totalAccountCount || 0} acc
                      </span>
                    </div>
                    {account.categories.length > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-base text-[oklch(0.75_0.15_350)]">
                          {(() => {
                            const minPrice = Math.min(
                              ...account.categories.map((c) => c.price)
                            );
                            const maxPrice = Math.max(
                              ...account.categories.map((c) => c.price)
                            );

                            if (minPrice === maxPrice) {
                              return `${minPrice.toLocaleString("vi-VN")}đ`;
                            }

                            return `${minPrice.toLocaleString(
                              "vi-VN"
                            )}đ - ${maxPrice.toLocaleString("vi-VN")}đ`;
                          })()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
