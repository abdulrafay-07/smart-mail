import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/main";
import { logoutUser } from "../handlers/logout-user";

export const useLogoutUser = () => {
  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  })
};
