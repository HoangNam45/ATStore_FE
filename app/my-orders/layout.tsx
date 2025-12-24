import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đơn Hàng Của Tôi",
  description: "Xem và quản lý đơn hàng của bạn tại ATStore.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function MyOrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
