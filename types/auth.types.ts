export interface SignupRequest {
  user_name: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  message: string;
  user?: {
    id: string;
    user_name: string;
    email: string;
  };
}

export interface VerifyEmailRequest {
  email: string;
  otp: string;
}

export interface VerifyEmailResponse {
  message: string;
}

export interface ResendOtpRequest {
  email: string;
}

export interface ResendOtpResponse {
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    message: string;
    user: {
      uid: string;
      email: string;
      displayName: string;
      photoURL?: string;
      role: string;
      provider: string;
      emailVerified: boolean;
      createdAt: {
        _seconds: number;
        _nanoseconds: number;
      };
      updatedAt: {
        _seconds: number;
        _nanoseconds: number;
      };
      lastLoginAt?: {
        _seconds: number;
        _nanoseconds: number;
      };
    };
  };
  timestamp: string;
  path: string;
}

export interface SocialLoginRequest {
  idToken: string;
  provider: "google" | "facebook";
  email?: string;
  displayName?: string;
  photoURL?: string;
}

export interface SignInRequest {
  email: string;
  password: string;
  remember?: boolean;
}

export interface SocialSignInRequest {
  remember?: boolean;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: string;
  provider: string;
  emailVerified: boolean;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  updatedAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  lastLoginAt?: {
    _seconds: number;
    _nanoseconds: number;
  };
}

export interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
  getInitials: () => string;
  isUserOwner: () => boolean;
}
