import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thanh Toán",
  description: "Hoàn tất thanh toán mua tài khoản game tại ATStore.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
