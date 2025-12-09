"use client";

import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { accountService } from "@/services/account.service";

interface GameStat {
  name: string;
  total: number;
  sold: number;
  revenue: number;
}

interface DashboardStats {
  totalAccounts: number;
  soldAccounts: number;
  revenue: number;
  gameStats: GameStat[];
}

export default function OwnerDashboard() {
  const { data: stats, error } = useQuery<DashboardStats>({
    queryKey: ["dashboardStats"],
    queryFn: accountService.getDashboardStats,
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <p className="text-red-500 mb-2">
            Failed to load dashboard statistics
          </p>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

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
              {stats.gameStats && stats.gameStats.length > 0 ? (
                stats.gameStats.map((game, index) => (
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
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 text-center text-sm text-muted-foreground"
                  >
                    Chưa có dữ liệu thống kê
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
