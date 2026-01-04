import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Hướng dẫn mua hàng | ATStore",
  description:
    "Các bước mua tài khoản tại ATStore: đăng nhập, chọn game, thanh toán và nhận tài khoản an toàn.",
};

const steps = [
  {
    title: "Chọn account",
    detail:
      "Chọn loại account bạn muốn mua, nhập số lượng sau đó bấm vào nút `Mua ngay` để tiến hành thanh toán",
    images: ["/images/guide/Guide1.PNG"],
  },
  {
    title: "Xác nhận đơn hàng",
    detail:
      "Xác nhận thông tin đơn hàng, nhập gmail(tự động điền nếu đã đăng nhập) để nhận thông tin account.",
    images: ["/images/guide/Guide2.PNG"],
  },
  {
    title: "Thanh toán",
    detail:
      "Quét mã QR(khuyến khích), hoặc nhập chính xác nội dụng chuyển khoản để hệ thống xác thực thanh toán.",
    images: ["/images/guide/Guide3.PNG"],
  },
  {
    title: "Nhận thông tin account",
    detail:
      "Sau khi thanh toán thành công, thông tin tài khoản sẽ được gửi về gmail đã được nhập trước đó.",
    images: ["/images/guide/Guide4.PNG"],
  },
  {
    title: "Lưu ý quan trọng",
    details: [
      "Đổi mật khẩu ngay sau khi đăng nhập để đảm bảo an toàn tài khoản của bạn.",
      "Liên hệ hỗ trợ nếu gặp bất kỳ vấn đề gì trong quá trình mua hàng.",
      "Ngoài ra bạn có thể liên hệ trực tiếp Facebook/Zalo để mua hàng.",
    ],
    hideStepNumber: true,
  },
];

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-10 text-foreground dark:bg-black">
      <div className="mx-auto max-w-3xl space-y-10">
        <div className="space-y-3 text-center">
          <h1 className="text-2xl font-semibold sm:text-3xl">
            Hướng dẫn mua hàng
          </h1>
        </div>

        <div className="space-y-4 rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border/60">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="flex flex-col gap-4 rounded-xl border border-border/60 bg-card/60 p-4"
            >
              <div className="space-y-1">
                <h2 className="text-base font-semibold">
                  {step.hideStepNumber
                    ? step.title
                    : `Bước ${index + 1}: ${step.title}`}
                </h2>
                {Array.isArray(step.details) ? (
                  <div className="space-y-2">
                    {step.details.map((line, lineIndex) => (
                      <p
                        key={lineIndex}
                        className="text-sm text-muted-foreground"
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">{step.detail}</p>
                )}
              </div>

              {/* Hình ảnh minh họa */}
              {step.images && step.images.length > 0 && (
                <div
                  className={`grid gap-3 ${
                    step.images.length === 1
                      ? "grid-cols-1"
                      : "grid-cols-1 sm:grid-cols-2"
                  }`}
                >
                  {step.images.map((image, imgIndex) => (
                    <div
                      key={imgIndex}
                      className="relative aspect-video overflow-hidden rounded-lg border border-border/40 bg-muted"
                    >
                      <Image
                        src={image}
                        alt={`${step.title} - Hình ${imgIndex + 1}`}
                        fill
                        className="object-contain"
                        sizes="(max-width: 640px) 100vw, 50vw"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
