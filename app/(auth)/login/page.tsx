"use client";

import { LoginForm } from "@/components/Auth/LoginForm/LoginForm";
import { useLogin } from "@/hooks/useLogin";

export default function LoginPage() {
  const {
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
  } = useLogin();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <LoginForm
        email={email}
        password={password}
        loading={loading}
        error={error}
        remember={remember}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onRememberChange={setRemember}
        onSubmit={handleEmailLogin}
        onGoogle={handleGoogleLogin}
        onFacebook={handleFacebookLogin}
      />
    </div>
  );
}
