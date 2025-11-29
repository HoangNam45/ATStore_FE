"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { RegisterForm } from "@/components/Auth/RegisterForm/RegisterForm";
import { authService } from "@/services/auth.service";
import { registerSchema, RegisterFormData } from "@/schemas/auth.schema";

export default function RegisterPage() {
  const router = useRouter();
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      user_name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

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

  return (
    <RegisterForm
      form={form}
      onSubmit={onSubmit}
      loading={signupMutation.isPending}
    />
  );
}
