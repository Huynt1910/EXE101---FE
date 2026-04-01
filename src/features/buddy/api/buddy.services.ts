import type { ApiResponse } from "@/features/api-type";
import type { Buddy } from "@/features/buddy/type";
import { httpClient } from "@/lib/http/client";

const BUDDY_BASE_PATH = "/api/Buddies";

export const buddyApi = {
  async getBuddyById(id: string) {
    const res = await httpClient.get<ApiResponse<Buddy>>(
      `${BUDDY_BASE_PATH}/${id}`,
    );
    return res.data;
  },
};
