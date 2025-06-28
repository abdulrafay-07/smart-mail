import { useQuery } from "@tanstack/react-query";

import { getUserMails } from "../handlers/get-user-mails";

export const useGetUserMails = () => {
  return useQuery({
    queryKey: ["mails"],
    queryFn: getUserMails,
  });
};
