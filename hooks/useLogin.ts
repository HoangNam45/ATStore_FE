"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmail,
  signInWithGoogle,
  signInWithFacebook,
} from "@/lib/firebase";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/useAuthStore";

export const useLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remember, setRemember] = useState(false);
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const getErrorMessage = (err: unknown, fallback: string) => {
    if (typeof err === "string") return err;
    if (err instanceof Error && err.message) return err.message;
    if (typeof err === "object" && err !== null) {
      const maybe = err as { response?: { data?: { message?: unknown } } };
      const msg = maybe.response?.data?.message;
      if (typeof msg === "string") return msg;
    }
    return fallback;
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userCredential = await signInWithEmail(email, password);
      const response = await authService.login({ email, password });
      setUser(response.data.user);
      router.push("/");
    } catch (err: unknown) {
      console.error("Login error:", err);
      setError(
        getErrorMessage(
          err,
          "Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const userCredential = await signInWithGoogle();
      const idToken = await userCredential.user.getIdToken();
      const response = await authService.socialLogin({
        idToken,
        provider: "google",
        email: userCredential.user.email || undefined,
        displayName: userCredential.user.displayName || undefined,
        photoURL: userCredential.user.photoURL || undefined,
      });
      setUser(response.data.user);
      router.push("/");
    } catch (err: unknown) {
      console.error("Google login error:", err);
      setError(
        getErrorMessage(err, "Đăng nhập với Google thất bại. Vui lòng thử lại.")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithFacebook();
      const idToken = await userCredential.user.getIdToken();
      const response = await authService.socialLogin({
        idToken,
        provider: "facebook",
        email: userCredential.user.email || undefined,
        displayName: userCredential.user.displayName || undefined,
        photoURL: userCredential.user.photoURL || undefined,
      });
      setUser(response.data.user);
      router.push("/");
    } catch (err: unknown) {
      console.error("Facebook login error:", err);
      setError(
        getErrorMessage(
          err,
          "Đăng nhập với Facebook thất bại. Vui lòng thử lại."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    password,
    loading,
    error,
    remember,
    setEmail,
    setPassword,
    setRemember,
    handleEmailLogin,
    handleGoogleLogin,
    handleFacebookLogin,
  };
};
