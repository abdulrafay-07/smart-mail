import { createRootRoute, Outlet } from "@tanstack/react-router";

import { CheckAuthLayout } from "@/components/protected-layout";

export const Route = createRootRoute({
  component: () => (
    <CheckAuthLayout>
      <Outlet />
    </CheckAuthLayout>
  )
});
