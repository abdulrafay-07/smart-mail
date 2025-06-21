import { useQuery } from "@tanstack/react-query"

import { getCurrentUser } from "../handlers/get-current-user"

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: false,
  });
}