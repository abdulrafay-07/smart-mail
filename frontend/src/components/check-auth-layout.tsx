import { useNavigate } from "@tanstack/react-router";

import { useGetCurrentUser } from "@/features/user/api/use-get-current-user";
import { useUser } from "@/store/user";
import { useEffect } from "react";

interface CheckAuthProps {
  children: React.ReactNode;
};

export const CheckAuthLayout = ({
  children,
}: CheckAuthProps) => {
  const navigate = useNavigate();

  const { setUser } = useUser();
  const { data: user, isLoading } = useGetCurrentUser();

  useEffect(() => {
    const isLoggedIn = user?.success;
    if (!isLoading) {
      if (!isLoggedIn) navigate({ to: "/auth" });
      setUser(user?.data.user!);

      if (isLoggedIn && window.location.pathname === "/auth") navigate({ to: "/" });
    }
  }, [isLoading, setUser, user, navigate]);

  return (
    <>
      {children}
    </>
  )
};
