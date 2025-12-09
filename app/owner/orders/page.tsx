"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { orderService } from "@/services/order.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Search,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Package,
  DollarSign,
} from "lucide-react";

export default function OrdersManagementPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const limit = 10;

  const { data, isLoading, error } = useQuery({
    queryKey: ["adminOrders", page, search, startDate, endDate],
    queryFn: () =>
      orderService.getAllOrdersAdmin({
        page,
        limit,
        search,
        startDate,
        endDate,
      }),
  });

  const formatDate = (timestamp: {
    _seconds: number;
    _nanoseconds: number;
  }) => {
    const date = new Date(timestamp._seconds * 1000);
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatPrice = (price: number): string => {
    return price.toLocaleString("vi-VN") + "đ";
  };

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearch("");
    setSearchInput("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const totalRevenue = data?.orders.reduce(
    (sum, order) => sum + order.totalPrice,
    0
  );

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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-800 dark:text-white mb-2">
            Quản lý đơn hàng
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Quản lý và theo dõi tất cả đơn hàng đã thanh toán
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Bộ lọc</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <Input
                      placeholder="Tìm theo mã đơn, email, game..."
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                      className="pl-10"
                    />
                  </div>
                  <Button onClick={handleSearch}>Tìm kiếm</Button>
                </div>
              </div>

              {/* Start Date */}
              <div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                  <Input
                    type="date"
                    placeholder="Từ ngày"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      setPage(1);
                    }}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* End Date */}
              <div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                  <Input
                    type="date"
                    placeholder="Đến ngày"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      setPage(1);
                    }}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {(search || startDate || endDate) && (
              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                >
                  Xóa bộ lọc
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Orders List */}
        {isLoading ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="h-8 w-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-zinc-600 dark:text-zinc-400">
                Đang tải đơn hàng...
              </p>
            </CardContent>
          </Card>
        ) : !data || data.orders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="mx-auto h-16 w-16 text-zinc-400 mb-4" />
              <h2 className="text-xl font-semibold mb-2 text-zinc-800 dark:text-white">
                Không tìm thấy đơn hàng
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {data.orders.map((order) => (
                <Card key={order.orderId} className="overflow-hidden">
                  <CardHeader className="bg-zinc-100 dark:bg-zinc-900 pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base font-semibold">
                          Mã đơn: {order.orderId}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <Badge
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        variant="outline"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Đã thanh toán
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Product Info */}
                      <div className="lg:col-span-2">
                        <div className="flex gap-4">
                          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                            <Image
                              src={order.displayImage}
                              alt={order.accountType}
                              fill
                              className="object-cover"
                            />
                          </div>

                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-zinc-800 dark:text-white mb-2">
                              {order.game} - {order.accountType}
                            </h3>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-zinc-600 dark:text-zinc-400">
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
                                <span className="font-medium">Đơn giá:</span>{" "}
                                {formatPrice(order.unitPrice)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Customer & Payment Info */}
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                            Khách hàng
                          </p>
                          <p className="text-sm font-medium text-zinc-800 dark:text-white">
                            {order.email}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                            Mã thanh toán
                          </p>
                          <p className="text-sm font-mono font-semibold text-pink-600 dark:text-pink-400">
                            {order.checkoutCode}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                            Tổng tiền
                          </p>
                          <p className="text-xl font-bold text-pink-600 dark:text-pink-400">
                            {formatPrice(order.totalPrice)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {data.totalPages > 1 && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Trang {data.page} / {data.totalPages} (Tổng {data.total}{" "}
                      đơn hàng)
                    </p>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Trước
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page + 1)}
                        disabled={page === data.totalPages}
                      >
                        Sau
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
