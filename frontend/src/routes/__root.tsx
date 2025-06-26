import { createRootRoute, Outlet } from "@tanstack/react-router";

import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { CheckAuthLayout } from "@/components/check-auth-layout";

export const Route = createRootRoute({
  component: () => (
    <CheckAuthLayout>
      <SidebarProvider className="w-full">
        <AppSidebar />
        <main className="flex-1 pl-4">
          <SidebarTrigger />
          <Outlet />
        </main>
      </SidebarProvider>
    </CheckAuthLayout>
  )
});
