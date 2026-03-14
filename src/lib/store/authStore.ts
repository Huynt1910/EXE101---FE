"use client";

import { useSyncExternalStore } from "react";
import { authApi } from "@/features/auth/api/services/auth.services";
import type { LoginRequest } from "@/features/auth/type";
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

function setAuthFromToken(token: string, writeCookie = true) {
	const payload = decodeJwtPayload(token);
	const user = mapJwtPayloadToUser(payload);

	if (!user) {
		return false;
	}

	if (writeCookie) {
		setCookie(cookieConfig.authToken.name, token, {
			...cookieConfig.authToken.options,
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

	const isValid = setAuthFromToken(response.data.accessToken);
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
	if (!token) {
		clearAuthState();
		return;
	}

	const isValid = setAuthFromToken(token, false);
	if (!isValid) {
		clearAuthState();
	}
}

function setAuthToken(token: string) {
	const isValid = setAuthFromToken(token, true);
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
	logout,
	restoreAuth,
	setAuthToken,
};
