import axios from "axios";

import { BASE_URL } from "@/config";
import type { ApiResponse } from "@/types/api";

export const getCurrentUser = async () => {
  const response = await axios.get<ApiResponse>(`${BASE_URL}/u`, {
    withCredentials: true,
  });

  if (!response.data.success) throw new Error(response.data.message);

  return response.data;
};
