import { toast } from "sonner";
import type { ApiError } from "@/lib/http/client";

export interface ErrorHandlerOptions {
  showTitle?: boolean;
  showDetails?: boolean;
  autoClose?: number;
}

/**
 * Map error status codes to user-friendly messages
 */
const errorMessages: Record<number, string> = {
  400: "Invalid request",
  401: "Unauthorized - Please log in",
  403: "Access denied",
  404: "Resource not found",
  500: "Server error - Please try again later",
};

/**
 * Handle API errors with Sonner toast notifications
 * Automatically extracts error message from backend response
 * 
 * @example
 * ```ts
 * catch (error) {
 *   handleApiError(error);
 * }
 * 
 * // With custom options
 * catch (error) {
 *   handleApiError(error, { showTitle: true });
 * }
 * ```
 */
export function handleApiError(
  error: unknown,
  options: ErrorHandlerOptions = {}
): void {
  const { showTitle = true, autoClose = 4000 } = options;

  // Handle ApiError from httpClient
  if (isApiError(error)) {
    const title = showTitle ? getErrorTitle(error.status) : undefined;
    const message = error.message || getErrorMessage(error.status);

    toast.error(message, {
      description: title,
      duration: autoClose,
    });
    return;
  }

  // Handle generic Error
  if (error instanceof Error) {
    toast.error(error.message || "An unexpected error occurred", {
      duration: autoClose,
    });
    return;
  }

  // Fallback
  toast.error("An unexpected error occurred", {
    duration: autoClose,
  });
}

/**
 * Get user-friendly error message based on status code
 * Prefers backend message if available
 */
export function getErrorMessage(status: number, defaultMessage?: string): string {
  return defaultMessage || errorMessages[status] || "An error occurred";
}

/**
 * Get error title based on status code
 */
export function getErrorTitle(status: number): string {
  const titles: Record<number, string> = {
    400: "Invalid Request",
    401: "Authentication Required",
    403: "Access Denied",
    404: "Not Found",
    500: "Server Error",
  };
  return titles[status] || `Error ${status}`;
}

/**
 * Type guard to check if error is ApiError
 */
function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    "message" in error &&
    typeof (error as any).status === "number"
  );
}

/**
 * Extract error message from mutation error
 * Works with React Query mutations
 */
export function getErrorMessageFromMutation(error: unknown): string {
  if (isApiError(error)) {
    return error.message || getErrorMessage(error.status);
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
}
