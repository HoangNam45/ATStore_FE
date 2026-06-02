import { Heart, Mail } from "lucide-react";
import Image from "next/image";

export function MaintenancePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(244,114,182,0.18),transparent_34%),linear-gradient(135deg,#fff7fb_0%,#ffffff_44%,#fff4e6_100%)] px-6 py-10 text-foreground">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl flex-col items-center justify-center text-center">
        <Image
          src="/header_img.png"
          alt="Raven sito logo"
          width={80}
          height={80}
        />

        <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
          Web mềnh chính thức dừng hoạt động. Cảm ơn các bạn đã ủng hộ và tin
          tưởng shop trong suốt thời gian qua ≽^•⩊•^≼
        </p>
      </section>
    </main>
  );
}
