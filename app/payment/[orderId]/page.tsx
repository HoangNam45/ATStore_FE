"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { CreditCard, ArrowLeft, Clock } from "lucide-react";
import Image from "next/image";
import { orderService } from "@/services/order.service";
import { Order, BankInfo } from "@/types/order.types";

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // TODO: Replace with actual bank info from backend/config
  const bankInfo: BankInfo = {
    bankName: "VietinBank",
    accountNo: "106880289426",
    accountName: "QUANG THI ANH TUYET",
  };

  const { data: order } = useQuery<Order>({
    queryKey: ["order", orderId],
    queryFn: () => orderService.getOrder(orderId),
    refetchInterval: (query) => {
      return query.state.data?.status === "pending" ? 10000 : false;
    },
    retry: 1,
  });

  // Calculate time left when order data is loaded
  useEffect(() => {
    if (!order) return;

    const expiresAt = new Date(order.expiresAt._seconds * 1000);
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();

    // Defer state update to avoid cascading renders
    const timeoutId = setTimeout(() => {
      setTimeLeft(Math.max(0, Math.floor(diff / 1000)));
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [order]);

  // Handle payment status changes
  useEffect(() => {
    if (!order) return;

    if (order.status === "paid") {
      alert("Thanh toán thành công! Thông tin account đã được gửi về email.");
      router.push("/");
    }
  }, [order, router]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const formatPrice = (price: number): string => {
    return price.toLocaleString("vi-VN") + "đ";
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-zinc-50 py-12 dark:bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-zinc-600 dark:text-zinc-400">
              Không tìm thấy đơn hàng
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 py-12 dark:bg-black">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Back Button */}
        <button
          onClick={() => router.push("/")}
          className="mb-6 flex items-center gap-2 text-zinc-600 transition-colors hover:text-[oklch(0.75_0.15_350)] dark:text-zinc-400 dark:hover:text-[oklch(0.75_0.15_350)]"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Về trang chủ</span>
        </button>

        {/* Countdown Timer */}
        {timeLeft > 0 && order.status === "pending" && (
          <div className="mb-6 rounded-lg border-2 border-orange-300 bg-orange-50 p-4 dark:border-orange-700 dark:bg-orange-950">
            <div className="flex items-center justify-center gap-2 text-orange-700 dark:text-orange-300">
              <Clock className="h-5 w-5" />
              <span className="text-lg font-semibold">
                Đơn hàng sẽ hết hạn sau: {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        )}

        {/* Expired Notice */}
        {timeLeft === 0 && order.status === "pending" && (
          <div className="mb-6 rounded-lg border-2 border-red-300 bg-red-50 p-4 dark:border-red-700 dark:bg-red-950">
            <div className="text-center text-red-700 dark:text-red-300">
              <p className="text-lg font-semibold">
                Đơn hàng đã hết hạn thanh toán
              </p>
              <p className="mt-2 text-sm">
                Vui lòng tạo đơn hàng mới để tiếp tục
              </p>
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* QR Code Payment */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Thanh toán đơn hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="inline-block rounded-lg border-2 border-dashed border-primary/30 bg-white p-4">
                    {order.qrCodeUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={order.qrCodeUrl}
                        alt="VietQR Code"
                        className="mx-auto h-64 w-64"
                      />
                    ) : (
                      <div className="flex h-64 w-64 items-center justify-center bg-zinc-100 dark:bg-zinc-800">
                        <p className="text-zinc-500">Đang tải QR code...</p>
                      </div>
                    )}
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Quét mã QR bằng app ngân hàng để thanh toán
                  </p>
                </div>

                <Separator />

                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <h3 className="mb-3 font-semibold text-blue-800">
                    Hướng dẫn thanh toán
                  </h3>
                  <ol className="space-y-1 text-sm text-blue-700">
                    <li>1. Mở app ngân hàng trên điện thoại</li>
                    <li>2. Chọn chức năng quét mã QR</li>
                    <li>3. Quét mã QR phía trên</li>
                    <li>4. Kiểm tra thông tin và xác nhận chuyển khoản</li>
                    <li>5. Chờ hệ thống xác nhận thanh toán</li>
                  </ol>
                </div>

                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                  <h3 className="mb-2 font-semibold text-yellow-800">
                    Lưu ý quan trọng
                  </h3>
                  <ul className="space-y-1 text-sm text-yellow-700">
                    <li>
                      • Chuyển đúng số tiền: {formatPrice(order.totalPrice)}
                    </li>
                    <li>• Nội dung:SEVQR TKPAT1 {order.checkoutCode}</li>
                    <li>• Không thay đổi nội dung chuyển khoản</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bank Info Sidebar */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Thông tin chuyển khoản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Ngân hàng</Label>
                    <p className="font-semibold">{bankInfo.bankName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Số tài khoản</Label>
                    <p className="font-mono font-semibold">
                      {bankInfo.accountNo}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Chủ tài khoản</Label>
                    <p className="font-semibold">{bankInfo.accountName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Số tiền</Label>
                    <p className="text-xl font-bold text-primary">
                      {formatPrice(order.totalPrice)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Nội dung</Label>
                    <p className="font-mono font-semibold text-red-600">
                      SEVQR TKPAT1 {order.checkoutCode}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Order Info */}
                <div className="space-y-3">
                  <h3 className="font-semibold">Thông tin đơn hàng</h3>
                  <div className="flex gap-3">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={order.displayImage}
                        alt={order.accountType}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-zinc-800 dark:text-white">
                        {order.accountType}
                      </p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {order.categoryName}
                      </p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        SL: {order.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">
                    <p>Mã đơn: {order.orderId}</p>
                    <p>Email: {order.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
