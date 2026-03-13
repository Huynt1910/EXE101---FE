export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  email: string;
  fullName: string;
  role: number;
  isEmailVerified: boolean;
  tokenType: string;
  accessToken: string;
  refreshToken: string;
}
