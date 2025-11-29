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

export const authService = {
  signup: async (data: SignupRequest): Promise<SignupResponse> => {
    const response = await axiosClient.post("/auth/signup", data);
    return response.data;
  },

  verifyEmail: async (
    data: VerifyEmailRequest
  ): Promise<VerifyEmailResponse> => {
    const response = await axiosClient.post("/auth/verify-email", data);
    return response.data;
  },

  resendOtp: async (data: ResendOtpRequest): Promise<ResendOtpResponse> => {
    const response = await axiosClient.post("/auth/resend-otp", data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosClient.post("/auth/login", data);
    return response.data;
  },

  socialLogin: async (data: SocialLoginRequest): Promise<LoginResponse> => {
    const response = await axiosClient.post("/auth/social-login", data);
    return response.data;
  },
};
