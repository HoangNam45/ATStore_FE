"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { registerSchema, RegisterFormData } from "@/schemas/auth.schema";
import { signInWithGoogle, signInWithFacebook } from "@/lib/firebase";
import { useAuthStore } from "@/store/useAuthStore";
import { AuthError } from "firebase/auth";

export const useRegister = () => {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      user_name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

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

  const signupMutation = useMutation({
    mutationFn: authService.signup,
    onSuccess: () => {
      const email = form.getValues("email");
      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Đăng ký thất bại, thử lại sau.";
      form.setError("root", { message: errorMessage });
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    signupMutation.mutate({
      user_name: data.user_name,
      email: data.email,
      password: data.password,
    });
  };

  const handleGoogleLogin = async () => {
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

        form.setError("root", {
          message: `Email ${
            email || "này"
          } đã được đăng ký với phương thức đăng nhập khác (Facebook). Vui lòng đăng nhập bằng Facebook, sau đó bạn có thể liên kết thêm Google trong cài đặt tài khoản.`,
        });
        return;
      }

      // Only log error if it's not the account-exists error
      console.error("Google login error:", err);

      form.setError("root", {
        message: getErrorMessage(
          err,
          "Đăng nhập với Google thất bại. Vui lòng thử lại."
        ),
      });
    }
  };

  const handleFacebookLogin = async () => {
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

        form.setError("root", {
          message: `Email ${
            email || "này"
          } đã được đăng ký với phương thức đăng nhập khác (Google). Vui lòng đăng nhập bằng Google, sau đó bạn có thể liên kết thêm Facebook trong cài đặt tài khoản.`,
        });
        return;
      }

      // Only log error if it's not the account-exists error
      console.error("Facebook login error:", err);

      form.setError("root", {
        message: getErrorMessage(
          err,
          "Đăng nhập với Facebook thất bại. Vui lòng thử lại."
        ),
      });
    }
  };

  return {
    form,
    onSubmit,
    handleGoogleLogin,
    handleFacebookLogin,
    loading: signupMutation.isPending,
  };
};
