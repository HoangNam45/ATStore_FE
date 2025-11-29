"use client";

import Link from "next/link";
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

type Props = {
  email: string;
  password: string;
  loading?: boolean;
  error?: string | null;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onGoogle: () => void;
  onFacebook?: () => void;
  remember?: boolean;
  onRememberChange?: (value: boolean) => void;
};

export function LoginForm({
  email,
  password,
  loading = false,
  error,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onGoogle,
  onFacebook,
  remember = false,
  onRememberChange,
}: Props) {
  return (
    <Card className="w-full max-w-md mx-auto border-border/50 bg-card/95 backdrop-blur-sm">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-4">
          <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold text-xl sm:text-2xl">
            {"AT"}
          </div>
        </div>
        <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
          Đăng nhập
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Đăng nhập để tiếp tục mua sắm tài khoản Project Sekai
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 px-4 sm:px-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground text-sm">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="example@email.com"
              className="bg-background border-border text-foreground h-10"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-foreground text-sm">
                Mật khẩu
              </Label>
              <Link
                href="#"
                className="text-xs sm:text-sm text-primary hover:underline"
              >
                Quên mật khẩu?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              placeholder="••••••••"
              className="bg-background border-border text-foreground h-10"
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
              <p className="text-xs sm:text-sm text-destructive">{error}</p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => onRememberChange?.(e.target.checked)}
                disabled={loading}
                className="h-4 w-4"
              />
              <span className="text-xs sm:text-sm">Ghi nhớ đăng nhập</span>
            </label>
            <div />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span className="text-sm">Đang xử lý...</span>
              </div>
            ) : (
              <span className="text-sm">Đăng nhập</span>
            )}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Hoặc</span>
          </div>
        </div>

        <div className="space-y-2">
          <Button
            variant="outline"
            onClick={onGoogle}
            className="w-full border-border text-foreground hover:bg-accent bg-transparent h-10"
            disabled={loading}
          >
            <svg className="mr-2 h-4 w-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-sm">Đăng nhập với Google</span>
          </Button>

          <Button
            variant="outline"
            onClick={onFacebook}
            className="w-full border-border text-foreground hover:bg-accent bg-transparent h-10"
            disabled={loading}
          >
            <svg className="mr-2 h-4 w-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07c0 4.99 3.66 9.13 8.44 9.95v-7.04H7.9v-2.91h2.54V9.41c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.23.2 2.23.2v2.46h-1.25c-1.23 0-1.61.77-1.61 1.56v1.88h2.74l-.44 2.91h-2.3V22c4.78-.82 8.44-4.96 8.44-9.93z"
              />
            </svg>
            <span className="text-sm">Đăng nhập với Facebook</span>
          </Button>
        </div>
      </CardContent>

      <CardFooter className="flex justify-center px-4 sm:px-6 pb-6">
        <p className="text-xs sm:text-sm text-muted-foreground text-center">
          Chưa có tài khoản?{" "}
          <Link
            href="/register"
            className="text-primary hover:underline font-medium"
          >
            Đăng ký ngay
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
