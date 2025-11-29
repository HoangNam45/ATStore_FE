import { z } from "zod";

export const registerSchema = z
  .object({
    user_name: z
      .string()
      .min(1, "Tên phải có ít nhất 2 ký tự")
      .max(50, "Tên không được quá 50 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    password: z
      .string()
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .max(100, "Mật khẩu không được quá 100 ký tự"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export const verifyEmailSchema = z.object({
  otp: z
    .string()
    .length(6, "Mã OTP phải có 6 chữ số")
    .regex(/^\d{6}$/, "Mã OTP chỉ chứa số"),
});

export type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>;

export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(1, "Mật khẩu là bắt buộc"),
  remember: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
