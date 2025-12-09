"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { games } from "@/data/games";
import { ChevronLeft, Minus, Plus } from "lucide-react";
import { accountService } from "@/services/account.service";
import { Account, Category } from "@/types/account.types";
import Breadcrumb from "@/components/Breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AccountDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const accountId = params.accountId as string;

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const game = games.find((g) => g.slug === slug);

  const { data: account } = useQuery({
    queryKey: ["account", accountId],
    queryFn: async () => {
      const data = await accountService.getAccountById(accountId);
      // Handle both direct data and wrapped response
      const accountData = data.data || data;

      // Set initial category when data loads
      if (
        accountData.categories &&
        accountData.categories.length > 0 &&
        !selectedCategory
      ) {
        setSelectedCategory(accountData.categories[0]);
      }

      return accountData as Account;
    },
    enabled: !!accountId,
  });

  const handleQuantityChange = (delta: number) => {
    if (!selectedCategory) return;
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= selectedCategory.accountCount) {
      setQuantity(newQuantity);
    }
  };

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setQuantity(1); // Reset quantity when changing category
  };

  const totalPrice = selectedCategory ? selectedCategory.price * quantity : 0;

  if (!account || !game) {
    return (
      <div className="min-h-screen bg-zinc-50 py-12 dark:bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-zinc-800 dark:text-white">
              Không tìm thấy account
            </h1>
          </div>
        </div>
      </div>
    );
  }

  const allImages = [account.displayImage, ...account.detailImages];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {/* Breadcrumb - Desktop only */}
      <div className="hidden md:block">
        <Breadcrumb
          items={[
            { label: "Trang chủ", href: "/" },
            { label: game.name, href: `/games/${slug}` },
            { label: account.type, active: true },
          ]}
        />
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Back Button - Mobile only */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-zinc-600 transition-colors hover:text-[oklch(0.75_0.15_350)] dark:text-zinc-400 dark:hover:text-[oklch(0.75_0.15_350)] md:hidden"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Quay lại</span>
        </button>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-white shadow-md dark:bg-zinc-900">
              <Image
                src={allImages[selectedImageIndex]}
                alt={account.type}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative aspect-video overflow-hidden rounded-md transition-all ${
                    selectedImageIndex === idx
                      ? "ring-2 ring-[oklch(0.75_0.15_350)]"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="25vw"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-zinc-800 dark:text-white">
                {account.type}
              </h1>
              <div className="mt-2 flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                <span className="font-medium">{game.name}</span>
                {account.server && (
                  <>
                    <span>•</span>
                    <span>Server: {account.server}</span>
                  </>
                )}
              </div>
            </div>

            {/* Category Selection */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-zinc-800 dark:text-white">
                Chọn loại sản phẩm
              </h3>
              <Select
                value={selectedCategory?.name || ""}
                onValueChange={(value) => {
                  const category = account.categories.find(
                    (c) => c.name === value
                  );
                  if (category) handleCategorySelect(category);
                }}
              >
                <SelectTrigger className="w-full border-2 border-zinc-300 bg-white px-4 py-3 text-zinc-800 transition-colors hover:border-[oklch(0.75_0.15_350)] focus:border-[oklch(0.75_0.15_350)] dark:border-zinc-700 dark:bg-zinc-900 dark:text-white">
                  <SelectValue placeholder="Chọn loại sản phẩm">
                    {selectedCategory && (
                      <span>
                        {selectedCategory.name} -{" "}
                        {selectedCategory.price.toLocaleString("vi-VN")}đ (Còn{" "}
                        {selectedCategory.accountCount} acc)
                      </span>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {account.categories.map((category, idx) => (
                    <SelectItem key={idx} value={category.name}>
                      <span className="flex items-center justify-between gap-4">
                        <span>{category.name}</span>
                        <span className="text-[oklch(0.75_0.15_350)]">
                          {category.price.toLocaleString("vi-VN")}đ
                        </span>
                        <span className="text-xs text-zinc-500">
                          (Còn {category.accountCount} acc)
                        </span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quantity Selector */}
            {selectedCategory && (
              <div>
                <h3 className="mb-3 text-sm font-semibold text-zinc-800 dark:text-white">
                  Số lượng
                </h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-zinc-300 transition-colors hover:border-[oklch(0.75_0.15_350)] hover:bg-[oklch(0.75_0.15_350)]/10 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-zinc-300 disabled:hover:bg-transparent dark:border-zinc-700 dark:hover:border-[oklch(0.75_0.15_350)]"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="min-w-12 text-center text-xl font-semibold text-zinc-800 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= selectedCategory.accountCount}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-zinc-300 transition-colors hover:border-[oklch(0.75_0.15_350)] hover:bg-[oklch(0.75_0.15_350)]/10 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-zinc-300 disabled:hover:bg-transparent dark:border-zinc-700 dark:hover:border-[oklch(0.75_0.15_350)]"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <span className="ml-2 text-sm text-zinc-600 dark:text-zinc-400">
                    / {selectedCategory.accountCount} có sẵn
                  </span>
                </div>
              </div>
            )}

            {/* Total Price */}
            <div className="rounded-lg bg-zinc-100 p-4 dark:bg-zinc-800">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  Tổng cộng
                </span>
                <span className="text-2xl font-bold text-[oklch(0.75_0.15_350)]">
                  {totalPrice.toLocaleString("vi-VN")}đ
                </span>
              </div>
            </div>

            {/* Buy Button */}
            <button
              onClick={() => {
                if (!selectedCategory) return;
                const checkoutData = {
                  accountId: account.id,
                  accountType: account.type,
                  game: slug,
                  server: account.server,
                  categoryName: selectedCategory.name,
                  quantity,
                  price: selectedCategory.price,
                  totalPrice,
                  displayImage: account.displayImage,
                };
                router.push(
                  `/checkout?data=${encodeURIComponent(
                    JSON.stringify(checkoutData)
                  )}`
                );
              }}
              disabled={!selectedCategory}
              className="w-full rounded-lg bg-[oklch(0.75_0.15_350)] py-4 font-semibold text-white transition-all hover:bg-[oklch(0.7_0.15_350)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Mua ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
