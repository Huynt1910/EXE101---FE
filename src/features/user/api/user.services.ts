import type { ApiResponse } from "@/features/api-type";
import type {
  UpdateUserProfileRequest,
  UserProfile,
} from "@/features/user/type";
import { httpClient } from "@/lib/http/client";

const USERS_BASE_PATH = "/Users";

export const userApi = {
  async getProfile() {
    const res = await httpClient.get<ApiResponse<UserProfile>>(
      `${USERS_BASE_PATH}/get-profile`,
    );
    return res.data;
  },

  async updateProfile(payload: UpdateUserProfileRequest) {
    const res = await httpClient.put<
      ApiResponse<UserProfile>,
      UpdateUserProfileRequest
    >(`${USERS_BASE_PATH}/update-profile`, payload);
    return res.data;
  },

  async uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append("profilePicture", file);

    const res = await httpClient.post<ApiResponse<unknown>, FormData>(
      `${USERS_BASE_PATH}/upload-avatar`,
      formData,
    );
    return res.data;
  },
};
