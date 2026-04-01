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

function setAuthFromToken(token: string, roles: unknown = [], writeCookie = true) {
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

function setAuthToken(token: string, roles: unknown = []) {
	const isValid = setAuthFromToken(token, roles, true);
	if (!isValid) {
		throw new Error("Invalid access token payload");
	}
	return isValid;
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
	setAuthToken,
};
