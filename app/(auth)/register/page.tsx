"use client";

import { RegisterForm } from "@/components/Auth/RegisterForm/RegisterForm";
import { useRegister } from "@/hooks/useRegister";

export default function RegisterPage() {
  const { form, onSubmit, handleGoogleLogin, handleFacebookLogin, loading } =
    useRegister();

  return (
    <RegisterForm
      form={form}
      onSubmit={onSubmit}
      onGoogle={handleGoogleLogin}
      onFacebook={handleFacebookLogin}
      loading={loading}
    />
  );
}
