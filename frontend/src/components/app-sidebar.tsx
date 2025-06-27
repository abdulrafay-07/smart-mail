import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";

import { useLogoutUser } from "@/features/user/api/use-logout-user";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, MailMinus, PlusCircle } from "lucide-react";

import { useUser } from "@/store/user";
import { sidebarItems } from "@/constants";

export const AppSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const path = location.pathname;

  const { mutate } = useLogoutUser();
  const { name, email, avatar_url, clearUser } = useUser();

  const handleLogout = () => {
    mutate(undefined, {
      onSuccess: () => {
        clearUser();
      },
    });
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4 group-data-[collapsible=icon]:p-2">
        <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
          <MailMinus className="size-6 text-primary" />
          <span className="text-lg font-medium group-data-[collapsible=icon]:hidden">smartmail</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Compose">
                <Button className="flex justify-start cursor-pointer">
                  <PlusCircle />
                  Compose
                </Button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) =>
                item ? (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={item.url === path}
                      tooltip={item.title}
                    >
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ) : null
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg" className="truncate cursor-pointer">
                  <Avatar className="size-8 group-data-[collapsible=icon]:size-6">
                    <AvatarImage src={avatar_url!} />
                    <AvatarFallback className="size-8 group-data-[collapsible=icon]:size-6">
                      {(name?.[0] || 'U').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="truncate text-sm font-medium group-data-[collapsible=icon]:hidden">{name}</span>
                    <span className="truncate text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">{email}</span>
                  </div>
                  {isOpen ? (
                    <ChevronDown className="ml-auto group-data-[collapsible=icon]:hidden" />
                  ) : (
                    <ChevronUp className="ml-auto group-data-[collapsible=icon]:hidden" />
                  )}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem onClick={handleLogout}>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
};
