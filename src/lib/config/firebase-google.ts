"use client";

import { FirebaseError, initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

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

export function getMissingFirebaseEnvVars(): string[] {
  return REQUIRED_FIREBASE_ENV.filter((name) => !FIREBASE_ENV[name]);
}

export async function signInWithGoogleAndGetIdToken(): Promise<string> {
  try {
    const missingVars = getMissingFirebaseEnvVars();

    if (missingVars.length > 0) {
      throw new Error(`Missing required Firebase env: ${missingVars.join(", ")}`);
    }

    const { auth, provider } = getFirebaseAuthAndProvider();
    const result = await signInWithPopup(auth, provider);
    const idToken = await result.user.getIdToken();

    if (!idToken) {
      throw new Error("Missing Firebase ID token");
    }

    return idToken;
  } catch (error) {
    if (error instanceof FirebaseError) {
      throw new Error(error.message || "Google sign-in failed");
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Google sign-in failed");
  }
}
