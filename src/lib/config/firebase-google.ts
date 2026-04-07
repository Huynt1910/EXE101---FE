"use client";

import { FirebaseError, initializeApp, getApp, getApps } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";

const SILENT_FIREBASE_ERRORS = new Set([
  "auth/cancelled-popup-request",
  "auth/popup-closed-by-user",
]);

const REDIRECT_PENDING_KEY = "google_redirect_pending";

let pendingPopup: Promise<string> | null = null;

const REQUIRED_FIREBASE_ENV = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
] as const;

const FIREBASE_ENV = {
  NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
} as const;

function getRequiredEnv(name: (typeof REQUIRED_FIREBASE_ENV)[number]): string {
  const value = FIREBASE_ENV[name];

  if (!value) {
    throw new Error(`Missing required Firebase env: ${name}`);
  }

  return value;
}

function getFirebaseConfig() {
  return {
    apiKey: getRequiredEnv("NEXT_PUBLIC_FIREBASE_API_KEY"),
    authDomain: getRequiredEnv("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
    projectId: getRequiredEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
    storageBucket: getRequiredEnv("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
    messagingSenderId: getRequiredEnv("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
    appId: getRequiredEnv("NEXT_PUBLIC_FIREBASE_APP_ID"),
    measurementId: FIREBASE_ENV.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };
}

function getFirebaseAuthAndProvider() {
  const app = getApps().length > 0 ? getApp() : initializeApp(getFirebaseConfig());
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  provider.addScope("openid");
  provider.addScope("email");
  provider.addScope("profile");

  provider.setCustomParameters({
    prompt: "select_account",
  });

  return { auth, provider };
}

export function isGooglePopupCancelError(error: unknown): boolean {
  return error instanceof FirebaseError && SILENT_FIREBASE_ERRORS.has(error.code);
}

export function getMissingFirebaseEnvVars(): string[] {
  return REQUIRED_FIREBASE_ENV.filter((name) => !FIREBASE_ENV[name]);
}

/**
 * Check for redirect result ONLY if we previously initiated a redirect.
 * Uses sessionStorage flag to avoid unnecessary getRedirectResult calls on every page load.
 */
export async function checkGoogleRedirectResult(): Promise<string | null> {
  try {
    if (typeof sessionStorage === "undefined") return null;

    // Only check if we previously initiated a redirect
    if (!sessionStorage.getItem(REDIRECT_PENDING_KEY)) return null;

    sessionStorage.removeItem(REDIRECT_PENDING_KEY);

    const { auth } = getFirebaseAuthAndProvider();
    const result = await getRedirectResult(auth);
    if (result?.user) {
      return (await result.user.getIdToken()) || null;
    }
    return null;
  } catch {
    return null;
  }
}

export async function signInWithGoogleAndGetIdToken(): Promise<string> {
  const missingVars = getMissingFirebaseEnvVars();
  if (missingVars.length > 0) {
    throw new Error(`Missing required Firebase env: ${missingVars.join(", ")}`);
  }

  if (pendingPopup) {
    return pendingPopup;
  }

  pendingPopup = (async () => {
    try {
      const { auth, provider } = getFirebaseAuthAndProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      if (!idToken) {
        throw new Error("Missing Firebase ID token");
      }

      return idToken;
    } catch (error) {
      // Popup blocked (common on mobile) → fallback to redirect
      if (error instanceof FirebaseError && error.code === "auth/popup-blocked") {
        const { auth, provider } = getFirebaseAuthAndProvider();
        sessionStorage.setItem(REDIRECT_PENDING_KEY, "1");
        await signInWithRedirect(auth, provider);
        return "" as never;
      }

      if (error instanceof FirebaseError && SILENT_FIREBASE_ERRORS.has(error.code)) {
        throw error;
      }

      if (error instanceof FirebaseError) {
        throw new Error(error.message || "Google sign-in failed");
      }

      if (error instanceof Error) {
        throw error;
      }

      throw new Error("Google sign-in failed");
    } finally {
      pendingPopup = null;
    }
  })();

  return pendingPopup;
}
