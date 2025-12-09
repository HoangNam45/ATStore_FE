"use client";

import { useQuery } from "@tanstack/react-query";
import { orderService } from "@/services/order.service";
import { Order } from "@/types/order.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import {
  CheckCircle2,
  Package,
  TrendingUp,
  ShoppingCart,
  CreditCard,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function MyOrdersPage() {
  const router = useRouter();
  const { data: orders = [], error } = useQuery<Order[]>({
    queryKey: ["userOrders"],
    queryFn: orderService.getUserOrders,
  });

  // Filter only paid orders
  const paidOrders = orders.filter((order) => order.status === "paid");

  // Calculate spending statistics
  const totalSpent = paidOrders.reduce(
    (sum, order) => sum + order.totalPrice,
    0
  );
  const totalOrders = paidOrders.length;
  const totalItems = paidOrders.reduce((sum, order) => sum + order.quantity, 0);

  const formatDate = (timestamp: {
    _seconds: number;
    _nanoseconds: number;
  }) => {
    const date = new Date(timestamp._seconds * 1000);
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatPrice = (price: number): string => {
    return price.toLocaleString("vi-VN") + "đ";
  };

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-50 py-12 dark:bg-black">
        <div className="container mx-auto px-4">
          <Card className="mx-auto max-w-2xl">
            <CardContent className="p-8 text-center">
              <Package className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">
                Không thể tải đơn hàng
              </h2>
              <p className="text-muted-foreground">
                {error instanceof Error ? error.message : "Đã có lỗi xảy ra"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 py-12 dark:bg-black">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-800 dark:text-white mb-2">
            Đơn hàng của tôi
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Lịch sử mua hàng và thống kê chi tiêu
          </p>
        </div>

        {/* Spending Statistics */}
        {paidOrders.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-pink-100 dark:bg-pink-900/20 rounded-lg">
                    <CreditCard className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Tổng chi tiêu
                    </p>
                    <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                      {formatPrice(totalSpent)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <ShoppingCart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Tổng đơn hàng
                    </p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {totalOrders}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Tổng tài khoản
                    </p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {totalItems}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {paidOrders.length === 0 ? (
          <Card className="mx-auto max-w-2xl">
            <CardContent className="p-12 text-center">
              <Package className="mx-auto h-16 w-16 text-zinc-400 mb-4" />
              <h2 className="text-xl font-semibold mb-2 text-zinc-800 dark:text-white">
                Chưa có đơn hàng nào
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                Bạn chưa thực hiện đơn hàng nào. Hãy khám phá các game và mua
                ngay!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-zinc-800 dark:text-white">
                Lịch sử đơn hàng
              </h2>
              <Badge
                className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                variant="outline"
              >
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Đã thanh toán
              </Badge>
            </div>

            {paidOrders.map((order) => (
              <Card key={order.orderId} className="overflow-hidden">
                <CardHeader className="bg-zinc-100 dark:bg-zinc-900 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <CardTitle className="text-base font-semibold">
                          Mã đơn: {order.orderId}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>
                    <Badge
                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      variant="outline"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="ml-1">Đã thanh toán</span>
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={order.displayImage}
                        alt={order.accountType}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Order Details */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-zinc-800 dark:text-white mb-1">
                        {order.game} - {order.accountType}
                      </h3>
                      <div className="space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                        <p>
                          <span className="font-medium">Server:</span>{" "}
                          {order.server}
                        </p>
                        <p>
                          <span className="font-medium">Loại:</span>{" "}
                          {order.categoryName}
                        </p>
                        <p>
                          <span className="font-medium">Số lượng:</span>{" "}
                          {order.quantity}
                        </p>
                        <p>
                          <span className="font-medium">Mã thanh toán:</span>{" "}
                          <span className="font-mono font-semibold text-pink-600 dark:text-pink-400">
                            {order.checkoutCode}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                        Tổng tiền
                      </p>
                      <p className="text-xl font-bold text-pink-600 dark:text-pink-400">
                        {formatPrice(order.totalPrice)}
                      </p>
                    </div>
                  </div>

                  <Separator className="my-4" />
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                    <p className="text-sm text-green-800 dark:text-green-300">
                      ✓ Đơn hàng đã được thanh toán thành công. Thông tin tài
                      khoản đã được gửi đến email:{" "}
                      <span className="font-semibold">{order.email}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
