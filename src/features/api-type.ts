export interface ApiErrorItem {
  field: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  code?: string | null;
  message: string | null;
  data: T;
  errors: ApiErrorItem[] | null;
  timestamp: string;
}
