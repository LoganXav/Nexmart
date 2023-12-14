import { type SidebarNavItem } from "@/types";

export interface DashboardConfig {
  sidebarNav: SidebarNavItem[];
}

export const dashboardConfig: DashboardConfig = {
  sidebarNav: [
    {
      title: "Account",
      href: "/dashboard/account",
      icon: "avatar",
      items: [],
    },
    {
      title: "Orders",
      href: "/dashboard/orders",
      icon: "dollarSign",
      items: [],
    },
  ],
};
