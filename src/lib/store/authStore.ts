"use client";

import { useSyncExternalStore } from "react";
import { authApi } from "@/features/auth/api/services/auth.services";
import type { LoginGoogleRequest, LoginRequest } from "@/features/auth/type";
import { decodeJwtPayload, mapJwtPayloadToUser, type AuthUser } from "@/lib/auth/decode-jwt";
import { cookieConfig, getCookie, removeCookie, setCookie } from "@/lib/config/cookie";
import { httpClient } from "@/lib/http/client";

interface AuthState {
	token: string | null;
	user: AuthUser | null;
	isAuthenticated: boolean;
}

const initialState: AuthState = {
	token: null,
	user: null,
	isAuthenticated: false,
};

let state: AuthState = initialState;
const listeners = new Set<() => void>();

function emit() {
	listeners.forEach((listener) => listener());
}

function setState(nextState: AuthState) {
	state = nextState;
	emit();
}

function getTokenMaxAge(token: string) {
	const payload = decodeJwtPayload(token);
	if (!payload?.exp) return undefined;

	const nowInSeconds = Math.floor(Date.now() / 1000);
	const maxAge = payload.exp - nowInSeconds;

	return Math.max(maxAge, 0);
}

function normalizeRoles(roles: unknown): string[] {
	if (Array.isArray(roles)) {
		return roles
			.filter((role): role is string => typeof role === "string" && role.trim() !== "")
			.map((role) => role.trim());
	}

	if (typeof roles === "string" && roles.trim() !== "") {
		return [roles.trim()];
	}

	return [];
}

function getStoredRoles(): string[] {
	const raw = getCookie(cookieConfig.authRoles.name);
	if (!raw) return [];

	try {
		return normalizeRoles(JSON.parse(raw));
	} catch {
		return [];
	}
}

function getStoredRefreshToken() {
	return getCookie(cookieConfig.authSession.name);
}

function setAuthFromToken(
	token: string,
	roles: unknown = [],
	writeCookie = true,
	refreshToken?: string | null,
) {
	const payload = decodeJwtPayload(token);
	const baseUser = mapJwtPayloadToUser(payload);
	const normalizedRoles = normalizeRoles(roles);
	const effectiveRoles =
		normalizedRoles.length > 0 ? normalizedRoles : (baseUser?.roles ?? []);

	const user: AuthUser | null = baseUser
		? {
				...baseUser,
				roles: effectiveRoles,
			}
		: null;

	if (!user) {
		return false;
	}

	if (writeCookie) {
		setCookie(cookieConfig.authToken.name, token, {
			...cookieConfig.authToken.options,
			maxAge: getTokenMaxAge(token),
		});

		setCookie(cookieConfig.authRoles.name, JSON.stringify(effectiveRoles), {
			...cookieConfig.authRoles.options,
			maxAge: getTokenMaxAge(token),
		});

		const nextRefreshToken =
			typeof refreshToken === "string" && refreshToken.trim() !== ""
				? refreshToken.trim()
				: getStoredRefreshToken();

		if (nextRefreshToken) {
			setCookie(cookieConfig.authSession.name, nextRefreshToken, {
				...cookieConfig.authSession.options,
			});
		}
	}

	httpClient.setAuthToken(token);
	setState({
		token,
		user,
		isAuthenticated: true,
	});

	return true;
}

function clearAuthState() {
	removeCookie(cookieConfig.authToken.name, cookieConfig.authToken.options.path);
	removeCookie(cookieConfig.authRoles.name, cookieConfig.authRoles.options.path);
	removeCookie(cookieConfig.authSession.name, cookieConfig.authSession.options.path);
	httpClient.setAuthToken(null);
	setState(initialState);
}

function subscribe(listener: () => void) {
	listeners.add(listener);
	return () => listeners.delete(listener);
}

function getSnapshot() {
	return state;
}

async function login(payload: LoginRequest) {
	const response = await authApi.login(payload);

	if (!response.success || !response.data?.accessToken) {
		throw new Error(response.message ?? "Login failed");
	}

	const isValid = setAuthFromToken(
		response.data.accessToken,
		response.data.roles ?? response.data.role ?? [],
		true,
		response.data.refreshToken,
	);
	if (!isValid) {
		throw new Error("Invalid access token payload");
	}

	return response;
}

async function loginGoogle(payload: LoginGoogleRequest) {
	const response = await authApi.loginGoogle(payload);

	if (!response.success || !response.data?.accessToken) {
		throw new Error(response.message ?? "Google login failed");
	}

	const isValid = setAuthFromToken(
		response.data.accessToken,
		response.data.roles ?? response.data.role ?? [],
		true,
		response.data.refreshToken,
	);
	if (!isValid) {
		throw new Error("Invalid access token payload");
	}

	return response;
}

function logout() {
	clearAuthState();
}

function restoreAuth() {
	const token = getCookie(cookieConfig.authToken.name);
	const roles = getStoredRoles();
	if (!token) {
		clearAuthState();
		return;
	}

	const isValid = setAuthFromToken(token, roles, false);
	if (!isValid) {
		clearAuthState();
	}
}

function setAuthToken(token: string, roles: unknown = [], refreshToken?: string | null) {
	const isValid = setAuthFromToken(token, roles, true, refreshToken);
	if (!isValid) {
		throw new Error("Invalid access token payload");
	}
	return isValid;
}

async function refreshSession() {
	const refreshToken = getStoredRefreshToken();
	if (!refreshToken) {
		throw new Error("Missing refresh token. Please sign in again.");
	}

	const response = await authApi.refreshToken({ refreshToken });

	if (!response.success || !response.data?.accessToken) {
		throw new Error(response.message ?? "Unable to refresh session.");
	}

	const isValid = setAuthFromToken(
		response.data.accessToken,
		response.data.roles ?? response.data.role ?? [],
		true,
		response.data.refreshToken ?? refreshToken,
	);

	if (!isValid) {
		throw new Error("Invalid access token payload");
	}

	return response;
}

export function useAuthStore() {
	return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export const authStore = {
	getState: getSnapshot,
	login,
	loginGoogle,
	logout,
	restoreAuth,
	refreshSession,
	setAuthToken,
};
