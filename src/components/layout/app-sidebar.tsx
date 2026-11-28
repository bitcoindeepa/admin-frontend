import * as React from "react"
import {
  LandmarkIcon,
  LayoutDashboardIcon,
  ReceiptTextIcon,
  ScrollTextIcon,
  ShieldUserIcon,
  UsersIcon,
} from "lucide-react"
import { Link } from "react-router"

import { NavMain, type NavItem } from "@/components/layout/nav-main"
import { NavUser } from "@/components/layout/nav-user"
import { Logo } from "@/components/logo"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const navItems: NavItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: <LayoutDashboardIcon /> },
  { title: "Members", url: "/members", icon: <UsersIcon /> },
  { title: "Transactions", url: "/transactions", icon: <ReceiptTextIcon /> },
  { title: "Bank Reviews", url: "/bank-reviews", icon: <LandmarkIcon /> },
  { title: "Admins", url: "/admins", icon: <ShieldUserIcon /> },
  { title: "Audit Log", url: "/audit-log", icon: <ScrollTextIcon /> },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<Link to="/dashboard" />}
            >
              <Logo className="h-6 w-auto" />
              <span className="text-base font-semibold">
                BitcoinDeepa Admin
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
