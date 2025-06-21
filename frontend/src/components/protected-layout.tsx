import { useNavigate } from "@tanstack/react-router";

import { useGetCurrentUser } from "@/features/user/api/use-get-current-user";

interface CheckAuthProps {
  children: React.ReactNode;
};

export const CheckAuthLayout = ({
  children,
}: CheckAuthProps) => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetCurrentUser();

  if (isLoading) {
    return <div>Loading..</div>
  }

  const isLoggedin = data?.success;
  if (!isLoggedin) navigate({ to: "/auth" });

  if (isLoggedin && window.location.pathname === "/auth") navigate({ to: "/" });

  return (
    <>
      {children}
    </>
  )
};
