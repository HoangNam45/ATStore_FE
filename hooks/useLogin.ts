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
import { AuthError } from "firebase/auth";

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
      // Step 1: Sign in with Firebase Client SDK
      const userCredential = await signInWithEmail(email, password);

      // Step 2: Get role from Firebase custom claims
      const idTokenResult = await userCredential.user.getIdTokenResult();
      const role = idTokenResult.claims.role as string | undefined;

      // Step 3: Send to backend to store user in database
      const response = await authService.login({ email, password });

      // Only add role to user object if it's admin
      const userData = {
        ...response.data.user,
        ...(role === "admin" && { role }),
      };

      setUser(userData);
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
      const idToken = await userCredential.user.getIdToken(true);

      // Get role from Firebase custom claims
      const idTokenResult = await userCredential.user.getIdTokenResult();
      const role = idTokenResult.claims.role as string | undefined;

      const response = await authService.socialLogin({
        idToken,
        provider: "google",
        email: userCredential.user.email || undefined,
        displayName: userCredential.user.displayName || undefined,
        photoURL: userCredential.user.photoURL || undefined,
      });

      // Check if this is a provider link (existing account)
      const user = response.data.user;
      if (user.providers.length > 1 && !user.providers.includes("google")) {
        // This shouldn't happen, but just in case
        console.info("Google account linked to existing account");
      }

      // Only add role to user object if it's admin
      const userData = {
        ...user,
        ...(role === "admin" && { role }),
      };

      setUser(userData);
      router.push("/");
    } catch (err: unknown) {
      // Check if account exists with different credential FIRST before logging
      if (
        err &&
        typeof err === "object" &&
        "code" in err &&
        err.code === "auth/account-exists-with-different-credential"
      ) {
        const authError = err as AuthError;
        const email = authError.customData?.email as string | undefined;

        setError(
          `Email ${
            email || "này"
          } đã được đăng ký với phương thức đăng nhập khác (Facebook). Vui lòng đăng nhập bằng Facebook, sau đó bạn có thể liên kết thêm Google trong cài đặt tài khoản.`
        );
        return;
      }

      // Only log error if it's not the account-exists error
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

      // Get role from Firebase custom claims
      const idTokenResult = await userCredential.user.getIdTokenResult();
      const role = idTokenResult.claims.role as string | undefined;

      const response = await authService.socialLogin({
        idToken,
        provider: "facebook",
        email: userCredential.user.email || undefined,
        displayName: userCredential.user.displayName || undefined,
        photoURL: userCredential.user.photoURL || undefined,
      });

      // Check if this is a provider link (existing account)
      const user = response.data.user;
      if (user.providers.length > 1 && !user.providers.includes("facebook")) {
        // This shouldn't happen, but just in case
        console.info("Facebook account linked to existing account");
      }

      // Only add role to user object if it's admin
      const userData = {
        ...user,
        ...(role === "admin" && { role }),
      };

      setUser(userData);
      router.push("/");
    } catch (err: unknown) {
      // Check if account exists with different credential FIRST before logging
      if (
        err &&
        typeof err === "object" &&
        "code" in err &&
        err.code === "auth/account-exists-with-different-credential"
      ) {
        const authError = err as AuthError;
        const email = authError.customData?.email as string | undefined;

        setError(
          `Email ${
            email || "này"
          } đã được đăng ký với phương thức đăng nhập khác (Google). Vui lòng đăng nhập bằng Google, sau đó bạn có thể liên kết thêm Facebook trong cài đặt tài khoản.`
        );
        return;
      }

      // Only log error if it's not the account-exists error
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
