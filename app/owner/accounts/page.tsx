"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function AccountsPage() {
  return (
    <div className="space-y-4 md:space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h1 className="text-lg md:text-3xl font-bold text-foreground truncate">
            Quản lý tài khoản
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1 truncate">
            Quản lý tất cả tài khoản game đang bán
          </p>
        </div>
        <Link href="/owner/accounts/new" className="shrink-0">
          <Button className="bg-primary text-primary-foreground h-8 md:h-10 text-xs md:text-sm">
            <Plus className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Thêm tài khoản</span>
            <span className="sm:hidden">Thêm</span>
          </Button>
        </Link>
      </div>

      {/* Content will be added later */}
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">
          Danh sách tài khoản sẽ hiển thị ở đây
        </p>
      </Card>
    </div>
  );
}
