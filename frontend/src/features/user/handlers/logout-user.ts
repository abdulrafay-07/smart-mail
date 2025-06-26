import axios from "axios";

import { BASE_URL } from "@/config";
import { type ApiResponse } from "@/types/api";

export const logoutUser = async () => {
  const response = await axios.post<ApiResponse>(`${BASE_URL}/u/logout`, {}, {
    withCredentials: true,
  });

  if (!response.data.success) throw new Error(response.data.message);

  return response.data;
};