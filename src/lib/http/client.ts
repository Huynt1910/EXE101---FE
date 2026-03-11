import axios, {
	AxiosError,
	AxiosHeaders,
	AxiosInstance,
	AxiosRequestConfig,
	AxiosResponse,
} from "axios";
import { httpEnv } from "./env";

export interface ApiError {
	status: number;
	message: string;
	code?: string;
	details?: unknown;
	raw?: unknown;
}

export interface RequestParams {
	[key: string]:
		| string
		| number
		| boolean
		| null
		| undefined
		| Array<string | number | boolean>;
}

export interface HttpResult<T> {
	data: T;
	status: number;
	headers: Record<string, string>;
}

type UnauthorizedHandler = () => void;

class AuthTokenStore {
	private token: string | null = null;

	get() {
		return this.token;
	}

	set(token: string | null) {
		this.token = token;
	}

	clear() {
		this.token = null;
	}
}

export const authTokenStore = new AuthTokenStore();

class HttpClient {
	private client: AxiosInstance;
	private onUnauthorized?: UnauthorizedHandler;

	constructor() {
		this.client = axios.create({
			baseURL: httpEnv.baseURL,
			timeout: httpEnv.timeout,
			headers: {
				"Content-Type": "application/json",
			},
		});

		this.setupInterceptors();
	}

	setOnUnauthorized(handler?: UnauthorizedHandler) {
		this.onUnauthorized = handler;
	}

	setAuthToken(token: string | null) {
		authTokenStore.set(token);
	}

	private setupInterceptors() {
		this.client.interceptors.request.use(
			(config) => {
				const token = authTokenStore.get();
				const headers = AxiosHeaders.from(config.headers);

				if (token) {
					headers.set("Authorization", `Bearer ${token}`);
				}

				if (config.data instanceof FormData) {
					headers.delete("Content-Type");
				}

				config.headers = headers;

				return config;
			},
			(error) => Promise.reject(error)
		);

		this.client.interceptors.response.use(
			(response) => response,
			(error: AxiosError<any>) => {
				const normalized: ApiError = {
					status: error.response?.status ?? 0,
					message:
						error.response?.data?.message ??
						error.message ??
						"Unexpected error occurred",
					code: error.response?.data?.code,
					details: error.response?.data?.details,
					raw: error.response?.data ?? error,
				};

				if (normalized.status === 401) {
					authTokenStore.clear();
					this.onUnauthorized?.();
				}

				return Promise.reject(normalized);
			}
		);
	}

	private createParams(params?: RequestParams): URLSearchParams | undefined {
		if (!params) return undefined;

		const search = new URLSearchParams();
		Object.entries(params).forEach(([key, value]) => {
			if (value === null || value === undefined) return;
			if (Array.isArray(value)) {
				value.forEach((v) => search.append(key, String(v)));
			} else {
				search.append(key, String(value));
			}
		});
		return search;
	}

	private async request<T>(config: AxiosRequestConfig): Promise<HttpResult<T>> {
		const response: AxiosResponse<T> = await this.client.request<T>(config);
		return {
			data: response.data,
			status: response.status,
			headers: response.headers as Record<string, string>,
		};
	}

	get<T>(url: string, params?: RequestParams) {
		return this.request<T>({
			method: "GET",
			url,
			params: this.createParams(params),
		});
	}

	post<T, D = unknown>(url: string, data?: D) {
		return this.request<T>({ method: "POST", url, data });
	}

	put<T, D = unknown>(url: string, data?: D) {
		return this.request<T>({ method: "PUT", url, data });
	}

	patch<T, D = unknown>(url: string, data?: D) {
		return this.request<T>({ method: "PATCH", url, data });
	}

	delete<T, D = unknown>(url: string, data?: D) {
		return this.request<T>({ method: "DELETE", url, data });
	}
}

export const httpClient = new HttpClient();
