export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginGoogleRequest {
  idToken: string;
}

export interface LoginResponse {
  email: string;
  fullName: string;
  role: string[];
  isEmailVerified: boolean;
  accessToken: string;
  refreshToken: string;
}

export interface SignUpRequest {
  email: string;
  fullName: string;
  password: string;
}

export interface SignUpResponse {
  email: string;
  fullName: string;
}

export interface VerifyEmailRequest {
  email: string;
  otpCode: string;
  purpose: string;
}

export interface RequestOtpRequest {
  email: string;
  purpose: string;
}

export interface VerifyEmailResponse {
  email: string;
  fullName: string;
  roles: string[];
  isEmailVerified: boolean;
  isEmailToken: string;
  refreshToken: string;
  accessToken: string;
}
