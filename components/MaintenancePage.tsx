import { Clock, Mail, Wrench } from "lucide-react";

export function MaintenancePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(244,114,182,0.18),transparent_34%),linear-gradient(135deg,#fff7fb_0%,#ffffff_44%,#fff4e6_100%)] px-6 py-10 text-foreground">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl flex-col items-center justify-center text-center">
        <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-pink-200/60">
          <Wrench className="h-8 w-8" aria-hidden="true" />
        </div>

        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          ATStore
        </p>

        <h1 className="max-w-2xl text-3xl font-bold leading-tight text-foreground sm:text-5xl">
          Website đang bảo trì
        </h1>

        <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
          Hệ thống đang được nâng cấp để xử lý sự cố máy chủ. Cảm ơn bạn đã
          thông cảm, ATStore sẽ sớm hoạt động trở lại.
        </p>

        <div className="mt-9 grid w-full max-w-xl gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-border/70 bg-white/75 p-5 text-left shadow-sm backdrop-blur">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Clock className="h-5 w-5" aria-hidden="true" />
            </div>
            <h2 className="text-base font-semibold">Đang khắc phục</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Đội ngũ kỹ thuật đang kiểm tra và sẽ mở lại web sớm nhất có thể.
            </p>
          </div>

          <div className="rounded-lg border border-border/70 bg-white/75 p-5 text-left shadow-sm backdrop-blur">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
              <Mail className="h-5 w-5" aria-hidden="true" />
            </div>
            <h2 className="text-base font-semibold">Cần hỗ trợ?</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Vui lòng liên hệ fanpage hoặc Zalo của shop nếu bạn cần xử lý đơn
              hàng gấp.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
