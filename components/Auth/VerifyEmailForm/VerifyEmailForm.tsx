"use client";

import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";

type FormData = {
  otp: string;
};

type Props = {
  form: UseFormReturn<FormData>;
  onSubmit: (data: FormData) => void;
  onResendOtp: () => void;
  loading?: boolean;
  resendLoading?: boolean;
  email?: string;
};

export function VerifyEmailForm({
  form,
  onSubmit,
  onResendOtp,
  loading = false,
  resendLoading = false,
  email,
}: Props) {
  const {
    setValue,
    handleSubmit,
    formState: { errors },
  } = form;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const canResend = countdown === 0;

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[0];
    }

    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    const otpString = newOtp.join("");
    setValue("otp", otpString);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    setValue("otp", newOtp.join(""));

    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleResendClick = () => {
    if (!canResend || resendLoading) return;
    setCountdown(30);
    onResendOtp();
  };

  return (
    <Card className="w-full z-9999 max-w-md border-border/50 bg-card/95 backdrop-blur-sm">
      <CardHeader className="text-center space-y-1">
        <CardTitle className="text-2xl font-bold text-foreground">
          Xác thực Email
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {email ? (
            <>
              Nhập mã OTP 6 chữ số đã được gửi đến <br />
              <span className="font-medium text-foreground">{email}</span>
            </>
          ) : (
            "Nhập mã OTP 6 chữ số đã được gửi đến email của bạn"
          )}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp">Mã OTP</Label>
            <div className="flex gap-2 justify-center">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="w-12 h-12 text-center text-2xl"
                  disabled={loading || resendLoading}
                  autoComplete="off"
                />
              ))}
            </div>
            {errors.otp && (
              <p className="text-sm text-destructive text-center">
                {errors.otp.message}
              </p>
            )}
          </div>

          {errors.root && (
            <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">{errors.root.message}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading || resendLoading}
          >
            {loading ? "Đang xác thực..." : "Xác thực"}
          </Button>

          <div className="text-center">
            <Button
              type="button"
              variant="ghost"
              onClick={handleResendClick}
              disabled={loading || resendLoading || !canResend}
              className="text-sm"
            >
              {resendLoading
                ? "Đang gửi lại..."
                : canResend
                ? "Gửi lại mã OTP"
                : `Gửi lại sau ${countdown}s`}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
