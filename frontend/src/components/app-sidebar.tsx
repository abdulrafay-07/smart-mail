import { useState } from "react";

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

  const { name, email, avatar_url, clearUser } = useUser();
  const { mutate } = useLogoutUser();

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
              <SidebarMenuButton asChild>
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
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
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
                <SidebarMenuButton className="truncate flex items-center justify-center cursor-pointer">
                  <Avatar className="size-7 group-data-[collapsible=icon]:size-6">
                    <AvatarImage src={avatar_url!} />
                    <AvatarFallback className="size-7 group-data-[collapsible=icon]:size-6">
                      {(name?.[0] || 'U').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate group-data-[collapsible=icon]:hidden">{email}</span>
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
