import { axiosClient } from "@/lib/axios";
import type {
  SignupRequest,
  SignupResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  ResendOtpRequest,
  ResendOtpResponse,
  LoginRequest,
  LoginResponse,
  SocialLoginRequest,
} from "@/types/auth.types";

/**
 * Envelope { success, data, timestamp, path } đã được bóc ở
 * lib/axios/interceptors/response.ts, nên mọi hàm trong này trả thẳng payload của BE.
 */
export const authService = {
  signup: async (data: SignupRequest): Promise<SignupResponse> => {
    const response = await axiosClient.post<SignupResponse>(
      "/auth/signup",
      data
    );
    return response.data;
  },

  verifyEmail: async (
    data: VerifyEmailRequest
  ): Promise<VerifyEmailResponse> => {
    const response = await axiosClient.post<VerifyEmailResponse>(
      "/auth/verify-email",
      data
    );
    return response.data;
  },

  resendOtp: async (data: ResendOtpRequest): Promise<ResendOtpResponse> => {
    const response = await axiosClient.post<ResendOtpResponse>(
      "/auth/resend-otp",
      data
    );
    return response.data;
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosClient.post<LoginResponse>(
      "/auth/login",
      data
    );
    return response.data;
  },

  socialLogin: async (data: SocialLoginRequest): Promise<LoginResponse> => {
    const response = await axiosClient.post<LoginResponse>(
      "/auth/social-login",
      data
    );
    return response.data;
  },
};
