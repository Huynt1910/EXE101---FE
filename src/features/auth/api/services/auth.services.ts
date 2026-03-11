import { httpClient } from "@/lib/http/client";
import { ApiResponse, LoginRequest, LoginResponse } from "../../type";

const AUTH_BASE_PATH = "/api/Auth";

export const authApi = {
	async login(payload: LoginRequest) {
		const res = await httpClient.post<ApiResponse<LoginResponse>, LoginRequest>(
			`${AUTH_BASE_PATH}/login`,
			payload
		);
		return res.data;
	},
};
