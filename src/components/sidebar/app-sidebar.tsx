"use client";

import * as React from "react";

// import { NavMain } from "@/components/sidebar/nav-main";
// import { NavProjects } from "@/components/sidebar/nav-projects";
// import { NavSecondary } from "@/components/sidebar/nav-secondary";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { BrandName } from "@/components/ui/brand-name";
import { ThemeToggle } from "@/components/theme-toggle";
import DirectMessageList from "@/components/chats/direct/direct-message-list";
import GroupMessageList from "@/components/chats/group/group-message-list";
import CreateGroupChatModal from "@/components/chats/modal/create-group-chat-modal";
import CreateNewChat from "@/components/chats/modal/create-new-chat";
import AddFriendModal from "@/components/chats/modal/add-friend-modal";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/stores/use-auth.store";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthStore();

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="dark:hover:bg-sidebar-accent/5"
            >
              <a href="#">
                <div className="flex aspect-square size-9 items-center justify-center rounded-sm bg-sidebar-primary text-sidebar-primary-foreground shadow shadow-primary">
                  {/* LOGO HERE */} Snap
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    <BrandName className="text-base" />
                  </span>
                  <span className="truncate text-xs">Connect world</span>
                </div>
                <ThemeToggle />
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* New chat */}
        <SidebarGroup>
          <SidebarGroupContent>
            <CreateNewChat />
          </SidebarGroupContent>
        </SidebarGroup>
        <Separator />
        {/* Direct chat */}
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase">Friends</SidebarGroupLabel>
          <SidebarGroupAction title="Create" className="cursor-pointer">
            <AddFriendModal />
          </SidebarGroupAction>
          <SidebarGroupContent>
            <DirectMessageList />
          </SidebarGroupContent>
        </SidebarGroup>
        <Separator />
        {/* Group chat */}
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase"> Group</SidebarGroupLabel>
          <SidebarGroupAction title="Create" className="cursor-pointer">
            <CreateGroupChatModal />
          </SidebarGroupAction>
          <SidebarGroupContent>
            <GroupMessageList />
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup></SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-1.5">
        {user && <NavUser user={user} />}
      </SidebarFooter>
    </Sidebar>
  );
}
