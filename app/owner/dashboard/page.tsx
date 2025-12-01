"use client";

import { Card } from "@/components/ui/card";
import { Package, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";

export default function OwnerDashboard() {
  // Mock data - sẽ thay bằng API call thực tế
  const stats = {
    totalAccounts: 156,
    soldAccounts: 89,
    revenue: 45600000,
    growth: 12.5,
  };

  const gameStats = [
    {
      name: "Project Sekai",
      total: 45,
      sold: 28,
      revenue: 15400000,
    },
    {
      name: "Bandori",
      total: 32,
      sold: 19,
      revenue: 8900000,
    },
    {
      name: "Uma Musume",
      total: 28,
      sold: 15,
      revenue: 9200000,
    },
    {
      name: "Cookie Run",
      total: 25,
      sold: 14,
      revenue: 6100000,
    },
    {
      name: "D4DJ",
      total: 15,
      sold: 8,
      revenue: 3200000,
    },
    {
      name: "Love and Deepspace",
      total: 11,
      sold: 5,
      revenue: 2800000,
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Dashboard
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground mt-1">
          Tổng quan hoạt động kinh doanh
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 md:gap-6 grid-cols-2 lg:grid-cols-4">
        <Card className="p-3 md:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-[9px] md:text-xs font-medium text-muted-foreground truncate">
                Tổng tài khoản
              </p>
              <p className="text-lg md:text-2xl font-bold text-foreground mt-1">
                {stats.totalAccounts}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-3 md:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-[9px] md:text-xs font-medium text-muted-foreground truncate">
                Đã bán
              </p>
              <p className="text-lg md:text-2xl font-bold text-foreground mt-1">
                {stats.soldAccounts}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-3 md:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-[9px] md:text-xs font-medium text-muted-foreground truncate">
                Doanh thu
              </p>
              <p className="text-lg md:text-2xl font-bold text-foreground mt-1 truncate">
                {formatCurrency(stats.revenue)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Game Statistics */}
      <Card className="p-3 md:p-6">
        <h2 className="text-base md:text-xl font-bold text-foreground mb-3 md:mb-4">
          Thống kê theo game
        </h2>
        <div className="overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-2 md:pb-3 text-left text-[9px] md:text-xs font-medium text-muted-foreground">
                  Game
                </th>
                <th className="pb-2 md:pb-3 text-right text-[9px] md:text-xs font-medium text-muted-foreground">
                  Tổng
                </th>
                <th className="pb-2 md:pb-3 text-right text-[9px] md:text-xs font-medium text-muted-foreground hidden sm:table-cell">
                  Bán
                </th>
                <th className="pb-2 md:pb-3 text-right text-[9px] md:text-xs font-medium text-muted-foreground hidden md:table-cell">
                  Còn
                </th>
                <th className="pb-2 md:pb-3 text-right text-[9px] md:text-xs font-medium text-muted-foreground">
                  Doanh thu
                </th>
              </tr>
            </thead>
            <tbody>
              {gameStats.map((game, index) => (
                <tr
                  key={index}
                  className="border-b border-border/50 last:border-0"
                >
                  <td className="py-2 md:py-4 text-[10px] md:text-sm font-medium text-foreground max-w-20 md:max-w-none truncate">
                    {game.name}
                  </td>
                  <td className="py-2 md:py-4 text-right text-[10px] md:text-sm text-foreground">
                    {game.total}
                  </td>
                  <td className="py-2 md:py-4 text-right text-[10px] md:text-sm text-green-600 hidden sm:table-cell">
                    {game.sold}
                  </td>
                  <td className="py-2 md:py-4 text-right text-[10px] md:text-sm text-muted-foreground hidden md:table-cell">
                    {game.total - game.sold}
                  </td>
                  <td className="py-2 md:py-4 text-right text-[9px] md:text-sm font-medium text-foreground">
                    <span className="hidden md:inline">
                      {formatCurrency(game.revenue)}
                    </span>
                    <span className="md:hidden">
                      {(game.revenue / 1000000).toFixed(1)}M
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
