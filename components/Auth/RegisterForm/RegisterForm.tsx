"use client";

import Link from "next/link";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type FormData = {
  user_name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type Props = {
  form: UseFormReturn<FormData>;
  onSubmit: (data: FormData) => void;
  loading?: boolean;
};

export function RegisterForm({ form, onSubmit, loading = false }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;
  return (
    <Card className="w-full max-w-md mx-auto border-border/50 bg-card/95 backdrop-blur-sm">
      <CardHeader className="text-center space-y-1">
        <div className="flex justify-center mb-4">
          <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold text-xl sm:text-2xl">
            {"AT"}
          </div>
        </div>
        <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
          Đăng ký
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Tạo tài khoản mới để tiếp tục mua sắm
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 px-4 sm:px-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user_name" className="text-sm">
              Tên hiển thị
            </Label>
            <Input
              id="user_name"
              {...register("user_name")}
              placeholder=""
              disabled={loading}
              className="h-10"
            />
            {errors.user_name && (
              <p className="text-xs sm:text-sm text-destructive">
                {errors.user_name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="example@gmail.com"
              disabled={loading}
              className="h-10"
            />
            {errors.email && (
              <p className="text-xs sm:text-sm text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm">
              Mật khẩu
            </Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              placeholder="••••••••"
              disabled={loading}
              className="h-10"
            />
            {errors.password && (
              <p className="text-xs sm:text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm" className="text-sm">
              Nhập lại mật khẩu
            </Label>
            <Input
              id="confirm"
              type="password"
              {...register("confirmPassword")}
              placeholder="••••••••"
              disabled={loading}
              className="h-10"
            />
            {errors.confirmPassword && (
              <p className="text-xs sm:text-sm text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {errors.root && (
            <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
              <p className="text-xs sm:text-sm text-destructive">
                {errors.root.message}
              </p>
            </div>
          )}

          <Button type="submit" className="w-full h-10" disabled={loading}>
            <span className="text-sm">
              {loading ? "Đang xử lý..." : "Đăng ký"}
            </span>
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center px-4 sm:px-6 pb-6">
        <p className="text-xs sm:text-sm text-muted-foreground text-center">
          Đã có tài khoản?{" "}
          <Link
            href="/login"
            className="text-primary hover:underline font-medium"
          >
            Đăng nhập
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
