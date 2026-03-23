import { httpClient } from "@/lib/http/client";
import {
  LoginGoogleRequest,
  LoginRequest,
  LoginResponse,
  RequestOtpRequest,
  SignUpRequest,
  SignUpResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
} from "../../type";
import type { ApiResponse } from "@/features/api-type";

const AUTH_BASE_PATH = "/api/Auth";

export const authApi = {
  async login(payload: LoginRequest) {
    const res = await httpClient.post<ApiResponse<LoginResponse>, LoginRequest>(
      `${AUTH_BASE_PATH}/login`,
      payload,
    );
    return res.data;
  },

  async loginGoogle(payload: LoginGoogleRequest) {
    const res = await httpClient.post<ApiResponse<LoginResponse>, LoginGoogleRequest>(
      `${AUTH_BASE_PATH}/login-google`,
      payload,
    );
    return res.data;
  },

  async register(payload: SignUpRequest) {
    const res = await httpClient.post<
      ApiResponse<SignUpResponse>,
      SignUpRequest
    >(`${AUTH_BASE_PATH}/register`, payload);
    return res.data;
  },

  async verifyEmail(payload: VerifyEmailRequest) {
    const res = await httpClient.post<
      ApiResponse<VerifyEmailResponse>,
      VerifyEmailRequest
    >(`${AUTH_BASE_PATH}/verify-otp`, payload);
    return res.data;
  },

  async requestOtp(payload: RequestOtpRequest) {
    const res = await httpClient.post<ApiResponse<null>, RequestOtpRequest>(
      `${AUTH_BASE_PATH}/request-otp`,
      payload,
    );
    return res.data;
  },
};
