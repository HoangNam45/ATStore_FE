import type { Metadata } from "next";
import { SakuraPetals } from "@/components/Theme/sakura-petals";

export const metadata: Metadata = {
  title: "Đăng Nhập",
  description: "Đăng nhập vào tài khoản ATStore để mua bán tài khoản game.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
      {children}
      <SakuraPetals />
    </div>
  );
}
