const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_TIMEOUT = process.env.NEXT_PUBLIC_API_TIMEOUT;

if (!API_BASE_URL) {
  throw new Error("Missing NEXT_PUBLIC_API_BASE_URL");
}

export const httpEnv = {
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT ? Number(API_TIMEOUT) : 10000,
};
