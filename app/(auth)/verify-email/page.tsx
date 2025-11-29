"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { VerifyEmailForm } from "@/components/Auth/VerifyEmailForm/VerifyEmailForm";
import { authService } from "@/services/auth.service";
import { verifyEmailSchema, VerifyEmailFormData } from "@/schemas/auth.schema";
import { Suspense } from "react";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const form = useForm<VerifyEmailFormData>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      otp: "",
    },
  });

  const verifyMutation = useMutation({
    mutationFn: authService.verifyEmail,
    onSuccess: () => {
      router.push("/login?verified=true");
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Xác thực thất bại, thử lại sau.";
      form.setError("root", { message: errorMessage });
    },
  });

  const resendMutation = useMutation({
    mutationFn: authService.resendOtp,
    onSuccess: () => {
      form.setError("root", {
        message: "Mã OTP đã được gửi lại vào email của bạn.",
      });
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Gửi lại mã OTP thất bại, thử lại sau.";
      form.setError("root", { message: errorMessage });
    },
  });

  const onSubmit = (data: VerifyEmailFormData) => {
    if (!email) {
      form.setError("root", {
        message: "Không tìm thấy email. Vui lòng đăng ký lại.",
      });
      return;
    }
    verifyMutation.mutate({ email, otp: data.otp });
  };

  const handleResendOtp = () => {
    if (!email) {
      form.setError("root", {
        message: "Không tìm thấy email. Vui lòng đăng ký lại.",
      });
      return;
    }
    resendMutation.mutate({ email });
  };

  return (
    <VerifyEmailForm
      form={form}
      onSubmit={onSubmit}
      onResendOtp={handleResendOtp}
      loading={verifyMutation.isPending}
      resendLoading={resendMutation.isPending}
      email={email || undefined}
    />
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
