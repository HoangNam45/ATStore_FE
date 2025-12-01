"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Layout/Sidebar/Sidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserOwner } = useAuthStore();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user || !isUserOwner()) {
      router.push("/");
    }
  }, [user, isUserOwner, router]);

  if (!user || !isUserOwner()) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-black">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-20 z-30 lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      <main className="flex-1 p-4 pt-[calc(73px+1rem)] lg:ml-64 lg:p-8 lg:pt-[calc(73px+2rem)]">
        {children}
      </main>
    </div>
  );
}
