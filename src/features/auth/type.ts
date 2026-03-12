export interface ApiErrorItem {
	field: string;
	message: string;
}

export interface ApiResponse<T> {
	success: boolean;
	message: string | null;
	data: T;
	errors: ApiErrorItem[] | null;
	timestamp: string;
}

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
