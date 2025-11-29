import { SakuraPetals } from "@/components/Theme/sakura-petals";

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
