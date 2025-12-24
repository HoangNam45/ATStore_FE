"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, ArrowLeft, CreditCard } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { games } from "@/data/games";
import { useAuthStore } from "@/store/useAuthStore";
import { orderService } from "@/services/order.service";
import { CheckoutData } from "@/types/order.types";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userEmail = useAuthStore((state) => state.user?.email);
  const userId = useAuthStore((state) => state.user?.uid);
  const [email, setEmail] = useState(userEmail || "");
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [orderId, setOrderId] = useState("");

  const createOrderMutation = useMutation({
    mutationFn: orderService.createOrder,
    onSuccess: (order) => {
      router.push(`/payment/${order.orderId}`);
    },
    onError: (error: Error) => {
      console.error("Error creating order:", error);
      alert("Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.");
    },
  });

  useEffect(() => {
    // Get data from URL params
    const data = searchParams.get("data");
    if (data) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(data));
        // Defer state updates to avoid calling setState synchronously within the effect,
        // which can trigger cascading renders.
        setTimeout(() => {
          setCheckoutData(parsedData);
          // Generate order ID with format ORD[6 random numbers]
          const randomNum = Math.floor(100000 + Math.random() * 900000); // 6-digit random number
          const id = `ORD${randomNum}`;
          setOrderId(id);
        }, 0);
      } catch (error) {
        console.error("Failed to parse checkout data:", error);
        router.push("/");
      }
    } else {
      router.push("/");
    }
  }, [searchParams, router]);

  const handlePayment = () => {
    if (!email) {
      alert("Vui lòng nhập email");
      return;
    }

    if (!checkoutData) {
      alert("Dữ liệu đơn hàng không hợp lệ");
      return;
    }

    const payload: any = {
      accountId: checkoutData.accountId,
      accountType: checkoutData.accountType,
      categoryName: checkoutData.categoryName,
      quantity: checkoutData.quantity,
      unitPrice: checkoutData.price,
      totalPrice: checkoutData.totalPrice,
      email,
      game: checkoutData.game,
      displayImage: checkoutData.displayImage,
    };

    if (checkoutData.server) {
      payload.server = checkoutData.server;
    }

    if (userId) {
      payload.userId = userId;
    }

    createOrderMutation.mutate(payload);
  };

  if (!checkoutData) {
    return (
      <div className="min-h-screen bg-zinc-50 py-12 dark:bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-zinc-600 dark:text-zinc-400">Đang tải...</p>
          </div>
        </div>
      </div>
    );
  }

  const game = games.find((g) => g.slug === checkoutData.game);

  return (
    <div className="min-h-screen bg-zinc-50 py-12 dark:bg-black">
      <div className="container mx-auto max-w-2xl px-4">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-zinc-600 transition-colors hover:text-[oklch(0.75_0.15_350)] dark:text-zinc-400 dark:hover:text-[oklch(0.75_0.15_350)]"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Quay lại</span>
        </button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Xác nhận đơn hàng</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Product Info */}
            <div className="flex gap-4 rounded-lg bg-zinc-100 p-4 dark:bg-zinc-800">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={checkoutData.displayImage}
                  alt={checkoutData.accountType}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">
                  {checkoutData.accountType}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Game: {game?.name || checkoutData.game}
                </p>
                {checkoutData.server && (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Server: {checkoutData.server}
                  </p>
                )}
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Loại: {checkoutData.categoryName}
                </p>
              </div>
            </div>

            <Separator />

            {/* Order Details */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">
                  Mã đơn hàng:
                </span>
                <span className="font-mono font-bold text-[oklch(0.75_0.15_350)]">
                  {orderId}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">
                  Số lượng:
                </span>
                <span className="font-semibold text-zinc-800 dark:text-white">
                  {checkoutData.quantity}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">
                  Đơn giá:
                </span>
                <span className="font-semibold text-zinc-800 dark:text-white">
                  {checkoutData.price.toLocaleString("vi-VN")}đ
                </span>
              </div>

              <Separator />

              <div className="flex justify-between">
                <span className="text-lg font-semibold text-zinc-800 dark:text-white">
                  Tổng thanh toán:
                </span>
                <span className="text-2xl font-bold text-[oklch(0.75_0.15_350)]">
                  {checkoutData.totalPrice.toLocaleString("vi-VN")}đ
                </span>
              </div>
            </div>

            <Separator />

            {/* Payment Method */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" /> Phương thức thanh toán
              </Label>
              <div className="rounded-lg border-2 border-zinc-300 bg-white px-4 py-3 dark:border-zinc-700 dark:bg-zinc-900">
                <span className="text-zinc-800 dark:text-white">
                  Chuyển khoản ngân hàng
                </span>
              </div>
            </div>

            <Separator />

            {/* Email Input */}
            <div className="space-y-3">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> Email nhận thông tin đơn hàng *
              </Label>

              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                className="h-12 text-lg"
                required
              />

              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Thông tin account sẽ được gửi tự động về email sau khi thanh
                toán thành công.
              </p>
            </div>

            {/* Payment Button */}
            <button
              onClick={handlePayment}
              disabled={!email || createOrderMutation.isPending}
              className="w-full rounded-lg bg-[oklch(0.75_0.15_350)] py-4 font-semibold text-white transition-all hover:bg-[oklch(0.7_0.15_350)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {createOrderMutation.isPending
                ? "Đang xử lý..."
                : "Thanh toán ngay"}
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
