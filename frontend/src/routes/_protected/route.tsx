import { createFileRoute, Outlet } from "@tanstack/react-router";

import { SidebarProvider } from "@/components/ui/sidebar";

import { Header } from "@/components/header";
import { AppSidebar } from "@/components/app-sidebar";
import { CheckAuthLayout } from "@/components/check-auth-layout";

export const Route = createFileRoute("/_protected")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <CheckAuthLayout>
      <SidebarProvider className="w-full">
        <AppSidebar />
        <main className="flex-1">
          <Header />
          <Outlet />
        </main>
      </SidebarProvider>
    </CheckAuthLayout>
  )
}
