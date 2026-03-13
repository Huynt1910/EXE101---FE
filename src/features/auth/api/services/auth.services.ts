import { httpClient } from "@/lib/http/client";
import { LoginRequest, LoginResponse } from "../../type";
import type { ApiResponse } from "@/features/api-type";

const AUTH_BASE_PATH = "/Auth";

export const authApi = {
  async login(payload: LoginRequest) {
    const res = await httpClient.post<ApiResponse<LoginResponse>, LoginRequest>(
      `${AUTH_BASE_PATH}/login`,
      payload,
    );
    return res.data;
  },
};
