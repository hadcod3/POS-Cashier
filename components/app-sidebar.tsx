"use client"

import * as React from "react"
import {
  IconDashboard,
  IconInnerShadowTop,
  IconUsers,
  IconCopyPlus,
  IconCategory2
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Session } from "next-auth";
import Link from "next/link"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Menu",
      url: "/dashboard/menu",
      icon: IconCategory2,
    },
    {
      title: "Add Item",
      url: "/dashboard/menu/create",
      icon: IconCopyPlus,
    },
    {
      title: "Employees",
      url: "/dashboard/employee",
      icon: IconUsers,
    }
  ],
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userData?: Session | null; 
  isAdminNavBar?: boolean
}

export function AppSidebar({ userData, isAdminNavBar, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Had Cashier</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {isAdminNavBar && (
          <NavMain items={data.navMain} />
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData || null} />
      </SidebarFooter>
    </Sidebar>
  )
}
