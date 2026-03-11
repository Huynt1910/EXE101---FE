# React/Next.js API Architecture Blueprint

## A) Scope & Assumptions

Tài liệu này là blueprint chuẩn cho project React/Next.js chưa có kiến trúc sẵn, dùng TypeScript và workflow:

**Component → Custom Hook (React Query) → Service → API Core (Axios)**

### Assumptions

- Framework: React + Next.js (App Router hoặc Pages Router đều áp dụng được)
- Ngôn ngữ: TypeScript
- Data fetching/caching: @tanstack/react-query
- HTTP client: axios
- Domain mẫu xuyên suốt: `wallet`
- Mục tiêu: chuẩn hóa gọi API, auth token, timeout, upload, query params, error handling

### Config knobs

- `NEXT_PUBLIC_API_BASE_URL`: URL backend
- `NEXT_PUBLIC_API_TIMEOUT_MS`: timeout request (ms)
- `AUTH_STORAGE_MODE`: `memory` | `cookie` | `hybrid`
- `ENABLE_API_DEBUG`: `true` | `false`

---

## B) Architecture Overview

```text
[Component: WalletView]
  - render UI
  - trigger actions
        |
        v
[Custom Hook: useWalletQuery / useWalletMutation]
  - useQuery / useMutation
  - cache key / invalidate
  - map UI-friendly state
        |
        v
[Service: walletService]
  - endpoint per domain
  - typed request/response
  - build query params
        |
        v
[API Core: api/core.ts]
  - axios instance config
  - auth attach
  - interceptors
  - standardized error
```

---

## C) Layer Responsibilities + Golden Rules

## 1) Component Layer

**Responsibilities**

- Render UI và nhận input người dùng
- Gọi custom hook để lấy dữ liệu/thực hiện mutation
- Hiển thị `loading/error/empty/success`

**Không làm**

- Không gọi axios/fetch trực tiếp
- Không biết chi tiết endpoint
- Không attach token thủ công

## 2) Custom Hook Layer

**Responsibilities**

- Bọc `useQuery`/`useMutation`
- Chuẩn hóa query keys, staleTime, retry, invalidate
- Trả state phù hợp cho UI

**Không làm**

- Không chứa logic HTTP thấp tầng (interceptor, headers)
- Không chứa business flow quá dài của nhiều domain

## 3) Service Layer

**Responsibilities**

- Định nghĩa request/response type theo domain
- Gọi endpoint thông qua API Core
- Build query params/payload theo yêu cầu API

**Không làm**

- Không giữ state UI
- Không thao tác DOM/toast/navigation

## 4) API Core Layer

**Responsibilities**

- Tạo axios instance thống nhất
- Request interceptor: attach token, xử lý FormData
- Response interceptor: normalize error, xử lý 401 policy
- Cung cấp typed HTTP methods chung

**Không làm**

- Không chứa logic business domain (wallet/user/order)

## Golden Rules

1. Component chỉ nói chuyện với Hook.
2. Hook chỉ nói chuyện với Service.
3. Service chỉ nói chuyện với API Core.
4. API Core không biết UI.
5. Token attach duy nhất tại API Core.
6. Error contract thống nhất toàn hệ thống.
7. Query key phải có convention rõ ràng, tránh hardcode rải rác.

---

## D) Folder Structure chuẩn

```text
src/
  api/
    core.ts
    authTokenStore.ts
    queryKeys.ts
    types.ts
  services/
    walletService.ts
  hooks/
    useWallet.ts
    useWalletMutation.ts
  components/
    wallet/
      WalletView.tsx
  store/
    authStore.ts
```

---

## E) Standards & Conventions

## 1) Error contract chuẩn

```ts
export interface ApiError {
  status: number;
  message: string;
  code?: string;
  details?: unknown;
  raw?: unknown;
}
```

**Quy ước**

- `status`: HTTP status hoặc `0` nếu network error
- `message`: thông điệp hiển thị thân thiện
- `code`: mã domain/backend (nếu có)
- `details`: payload lỗi có cấu trúc
- `raw`: lỗi gốc để debug

## 2) QueryKey convention

```ts
export const queryKeys = {
  wallet: {
    all: ['wallet'] as const,
    detail: () => ['wallet', 'detail'] as const,
    balance: () => ['wallet', 'balance'] as const,
    transactions: (params: WalletTxQueryParams) => ['wallet', 'transactions', params] as const,
  },
};

export interface WalletTxQueryParams {
  page?: number;
  pageSize?: number;
  transactionType?: 'TopUp' | 'Payment' | 'Refund' | 'TransferIn' | 'TransferOut';
  status?: 'Completed' | 'Pending' | 'Failed' | 'Cancelled';
}
```

**Quy ước**

- Key theo dạng domain-first (`['wallet', ...]`)
- Query có params phải đưa params vào key
- Không hardcode string key trực tiếp trong component

## 3) Auth token strategy + 401 policy

### Strategy

- `memory`: token sống trong memory (an toàn hơn trước XSS persistence, nhưng mất khi refresh)
- `cookie`: token trong cookie (phù hợp SSR/middleware)
- `hybrid`: cookie là source of truth, memory dùng để runtime nhanh

### 401 policy

- Khi nhận `401`: clear token memory/cookie theo mode
- Trigger `onUnauthorized` callback (logout + redirect login)
- Reject standardized `ApiError`

## 4) Timeout, baseURL, headers, FormData

- `baseURL` lấy từ env: `NEXT_PUBLIC_API_BASE_URL`
- `timeout` lấy từ env: `NEXT_PUBLIC_API_TIMEOUT_MS` (default 30000)
- default headers: `Content-Type: application/json`
- nếu `data instanceof FormData` thì remove `Content-Type` để browser tự set boundary

## 5) Response envelope (nếu backend dùng)

```ts
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  errors?: Array<{ field: string; message: string }>;
}
```

---

## F) Implementation Templates (copy-ready)

## 1) api/core.ts

```ts
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  RawAxiosRequestHeaders,
} from 'axios';

export interface ApiError {
  status: number;
  message: string;
  code?: string;
  details?: unknown;
  raw?: unknown;
}

export interface RequestParams {
  [key: string]: string | number | boolean | null | undefined | Array<string | number | boolean>;
}

export interface HttpResult<T> {
  data: T;
  status: number;
  headers: Record<string, string>;
}

type UnauthorizedHandler = () => void;

class AuthTokenStore {
  private token: string | null = null;
  get() {
    return this.token;
  }
  set(token: string | null) {
    this.token = token;
  }
  clear() {
    this.token = null;
  }
}

export const authTokenStore = new AuthTokenStore();

class ApiCore {
  private client: AxiosInstance;
  private onUnauthorized?: UnauthorizedHandler;

  constructor() {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
    const timeout = Number(process.env.NEXT_PUBLIC_API_TIMEOUT_MS ?? 30000);

    this.client = axios.create({
      baseURL,
      timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  setOnUnauthorized(handler?: UnauthorizedHandler) {
    this.onUnauthorized = handler;
  }

  setAuthToken(token: string | null) {
    authTokenStore.set(token);
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      config => {
        const token = authTokenStore.get();
        if (token) {
          const headers = (config.headers ?? {}) as RawAxiosRequestHeaders;
          headers.Authorization = `Bearer ${token}`;
          config.headers = headers;
        }

        if (config.data instanceof FormData) {
          const headers = (config.headers ?? {}) as RawAxiosRequestHeaders;
          delete headers['Content-Type'];
          config.headers = headers;
        }

        return config;
      },
      error => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      response => response,
      (error: AxiosError<any>) => {
        const normalized: ApiError = {
          status: error.response?.status ?? 0,
          message: error.response?.data?.message ?? error.message ?? 'Unexpected error occurred',
          code: error.response?.data?.code,
          details: error.response?.data?.details,
          raw: error.response?.data ?? error,
        };

        if (normalized.status === 401) {
          authTokenStore.clear();
          this.onUnauthorized?.();
        }

        return Promise.reject(normalized);
      }
    );
  }

  private createParams(params?: RequestParams): URLSearchParams | undefined {
    if (!params) return undefined;

    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === undefined) return;
      if (Array.isArray(value)) {
        value.forEach(v => search.append(key, String(v)));
      } else {
        search.append(key, String(value));
      }
    });
    return search;
  }

  private async request<T>(config: AxiosRequestConfig): Promise<HttpResult<T>> {
    const response: AxiosResponse<T> = await this.client.request<T>(config);
    return {
      data: response.data,
      status: response.status,
      headers: response.headers as Record<string, string>,
    };
  }

  get<T>(url: string, params?: RequestParams) {
    return this.request<T>({ method: 'GET', url, params: this.createParams(params) });
  }

  post<T, D = unknown>(url: string, data?: D) {
    return this.request<T>({ method: 'POST', url, data });
  }

  put<T, D = unknown>(url: string, data?: D) {
    return this.request<T>({ method: 'PUT', url, data });
  }

  patch<T, D = unknown>(url: string, data?: D) {
    return this.request<T>({ method: 'PATCH', url, data });
  }

  delete<T, D = unknown>(url: string, data?: D) {
    return this.request<T>({ method: 'DELETE', url, data });
  }

  async getBlob(url: string, params?: RequestParams): Promise<Blob> {
    const response = await this.client.get(url, {
      params: this.createParams(params),
      responseType: 'blob',
    });
    return response.data as Blob;
  }

  upload<T>(
    url: string,
    files: File | File[],
    fieldName = 'file',
    extra?: Record<string, string | number | boolean>,
    onProgress?: (percent: number) => void
  ) {
    const formData = new FormData();
    if (Array.isArray(files)) {
      files.forEach(file => formData.append(fieldName, file));
    } else {
      formData.append(fieldName, files);
    }

    if (extra) {
      Object.entries(extra).forEach(([k, v]) => formData.append(k, String(v)));
    }

    return this.request<T>({
      method: 'POST',
      url,
      data: formData,
      onUploadProgress: onProgress
        ? evt => {
            const total = evt.total ?? 1;
            const percent = Math.round((evt.loaded * 100) / total);
            onProgress(percent);
          }
        : undefined,
    });
  }
}

export const apiCore = new ApiCore();
```

## 2) services/walletService.ts

```ts
import { apiCore, RequestParams } from '@/api/core';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  errors?: Array<{ field: string; message: string }>;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  locked: boolean;
  createdAt: string;
  updatedAt: string;
}

export type TransactionType = 'TopUp' | 'Payment' | 'Refund' | 'TransferIn' | 'TransferOut';
export type TransactionStatus = 'Completed' | 'Pending' | 'Failed' | 'Cancelled';

export interface WalletTransaction {
  id: string;
  walletId: string;
  amount: number;
  transactionType: TransactionType;
  status: TransactionStatus;
  description: string;
  createdAt: string;
}

export interface WalletTxList {
  items: WalletTransaction[];
  page: number;
  pageSize: number;
  total: number;
}

export interface WalletTxQueryParams {
  page?: number;
  pageSize?: number;
  transactionType?: TransactionType;
  status?: TransactionStatus;
}

export interface TopUpRequest {
  amount: number;
  description?: string;
  bankCode?: string;
}

export interface TopUpResult {
  paymentUrl: string;
  transactionId: string;
  amount: number;
}

const toParams = (params?: WalletTxQueryParams): RequestParams | undefined => {
  if (!params) return undefined;
  return {
    page: params.page,
    pageSize: params.pageSize,
    transactionType: params.transactionType,
    status: params.status,
  };
};

export const walletService = {
  async getWallet() {
    const res = await apiCore.get<ApiResponse<Wallet>>('/api/wallet');
    return res.data;
  },

  async getTransactions(params?: WalletTxQueryParams) {
    const res = await apiCore.get<ApiResponse<WalletTxList>>(
      '/api/wallet/transactions',
      toParams(params)
    );
    return res.data;
  },

  async topUp(payload: TopUpRequest) {
    const res = await apiCore.post<ApiResponse<TopUpResult>, TopUpRequest>(
      '/api/wallet/topup',
      payload
    );
    return res.data;
  },
};
```

## 3) hooks/useWallet.ts

```ts
import { useQuery } from '@tanstack/react-query';
import { walletService, WalletTxQueryParams } from '@/services/walletService';

export const queryKeys = {
  wallet: {
    all: ['wallet'] as const,
    detail: () => ['wallet', 'detail'] as const,
    transactions: (params: WalletTxQueryParams) => ['wallet', 'transactions', params] as const,
  },
};

export function useWalletQuery() {
  return useQuery({
    queryKey: queryKeys.wallet.detail(),
    queryFn: () => walletService.getWallet(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useWalletTransactionsQuery(params: WalletTxQueryParams) {
  return useQuery({
    queryKey: queryKeys.wallet.transactions(params),
    queryFn: () => walletService.getTransactions(params),
    staleTime: 60 * 1000,
  });
}
```

## 4) hooks/useWalletMutation.ts

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { walletService, TopUpRequest, WalletTxQueryParams } from '@/services/walletService';
import { queryKeys } from './useWallet';

export function useWalletTopUpMutation(currentTxParams: WalletTxQueryParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TopUpRequest) => walletService.topUp(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.detail() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.wallet.transactions(currentTxParams),
      });
    },
  });
}
```

## 5) components/WalletView.tsx

```tsx
'use client';

import React from 'react';
import { useWalletQuery, useWalletTransactionsQuery } from '@/hooks/useWallet';
import { useWalletTopUpMutation } from '@/hooks/useWalletMutation';

export default function WalletView() {
  const txParams = { page: 1, pageSize: 10 } as const;

  const { data: walletRes, isLoading: walletLoading, error: walletError } = useWalletQuery();
  const {
    data: txRes,
    isLoading: txLoading,
    error: txError,
  } = useWalletTransactionsQuery(txParams);

  const topUpMutation = useWalletTopUpMutation(txParams);

  const handleTopUp = async () => {
    try {
      const result = await topUpMutation.mutateAsync({
        amount: 100000,
        description: 'Top up from WalletView',
      });

      const paymentUrl = result.data.paymentUrl;
      if (paymentUrl) window.location.href = paymentUrl;
    } catch (err) {
      console.error(err);
    }
  };

  if (walletLoading || txLoading) return <div>Loading...</div>;
  if (walletError || txError) return <div>Failed to load wallet data.</div>;

  const wallet = walletRes?.data;
  const txItems = txRes?.data.items ?? [];

  return (
    <section>
      <h2>Wallet</h2>
      <p>Balance: {wallet?.balance ?? 0}</p>

      <button onClick={handleTopUp} disabled={topUpMutation.isPending}>
        {topUpMutation.isPending ? 'Processing...' : 'Top Up'}
      </button>

      <ul>
        {txItems.map(item => (
          <li key={item.id}>
            {item.transactionType} - {item.amount} - {item.status}
          </li>
        ))}
      </ul>
    </section>
  );
}
```

---

## G) Checklist áp dụng cho project mới

- [ ] Khởi tạo `api/core.ts` với axios instance + request/response interceptors
- [ ] Chuẩn hóa `ApiError` contract toàn app
- [ ] Thiết lập `baseURL`, `timeout` qua env
- [ ] Thiết kế auth token strategy (`memory`/`cookie`/`hybrid`)
- [ ] Cài đặt 401 policy (clear token + redirect/login flow)
- [ ] Tạo convention query keys theo domain-first
- [ ] Tách service theo domain (`walletService`, `userService`, ...)
- [ ] Viết custom hooks bọc service (query/mutation + invalidate)
- [ ] Đảm bảo component chỉ consume hooks
- [ ] Áp dụng rule FormData upload trong API Core
- [ ] Review anti-patterns trước khi merge PR

---

## H) FAQ / Anti-patterns

## FAQ

**Q1: Có thể gọi axios trực tiếp trong component không?**

- Không. Điều này phá vỡ kiến trúc, khó test và khó chuẩn hóa error/auth.

**Q2: Hook có nên tự attach token không?**

- Không. Token attach chỉ nên xảy ra ở API Core interceptor.

**Q3: Service có nên show toast hoặc redirect không?**

- Không. Service chỉ xử lý domain API contract; UI behavior thuộc component/hook layer.

**Q4: Có cần response envelope `ApiResponse<T>` không?**

- Có nếu backend trả envelope thống nhất; nếu backend trả raw data, vẫn giữ typed contract tương ứng.

## Anti-patterns (tránh tuyệt đối)

1. Component gọi `axios.get(...)` trực tiếp.
2. Hook chứa endpoint string hardcode.
3. Service lưu state UI (`isModalOpen`, `selectedTab`, ...).
4. Nhiều nơi tự parse lỗi khác format.
5. Token được gắn thủ công ở nhiều file.
6. Query key đặt ngẫu nhiên không theo convention.
7. Trộn nhiều domain vào một service file lớn.

---

## End State mong muốn

- Mọi feature mới chỉ cần thêm:
  1. service domain,
  2. hooks domain,
  3. component consume hook.
- API Core giữ nguyên, dùng lại cho toàn bộ project.
- Onboarding dev mới nhanh, mở rộng domain dễ, và giảm mạnh code lặp khi gọi API.
