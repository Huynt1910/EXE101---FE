export type ApiError = string;

export interface ApiResponse<T> {
  success: boolean;
  message: string | null;
  data: T;
  errors: ApiError[] | null;
  timestamp: string;
}

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
