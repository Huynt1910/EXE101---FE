import type { ApiResponse } from "@/features/api-type";
import type {
  UpdateUserProfileRequest,
  UserProfile,
} from "@/features/user/type";
import { httpClient } from "@/lib/http/client";

const SELF_SERVICE_GET_PROFILE_PATH = "/api/Users/get-profile";
const SELF_SERVICE_UPDATE_PROFILE_PATH = "/api/Users/update-profile";
const SELF_SERVICE_AVATAR_PATH = "/api/Users/upload-avatar";

export const userApi = {
  async getProfile() {
    const res = await httpClient.get<ApiResponse<UserProfile>>(
      SELF_SERVICE_GET_PROFILE_PATH,
    );
    return res.data;
  },

  async updateProfile(payload: UpdateUserProfileRequest) {
    const res = await httpClient.put<
      ApiResponse<UserProfile>,
      UpdateUserProfileRequest
    >(SELF_SERVICE_UPDATE_PROFILE_PATH, payload);
    return res.data;
  },

  async uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append("profilePicture", file);

    const res = await httpClient.post<ApiResponse<unknown>, FormData>(
      SELF_SERVICE_AVATAR_PATH,
      formData,
    );
    return res.data;
  },
};
