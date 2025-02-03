// src/components/custom/sidebar/app-sidebar.tsx
"use client"

import { useEffect, useState } from "react"
import { NavMain } from "./nav-main"
import { LucideIcon } from "lucide-react"
import { Permission } from "@prisma/client"
import { NavProjects } from "./nav-projects"
import { Icons } from "@/components/ui/icons"
import { useTranslation } from "react-i18next"
import { NavSecondary } from "./nav-secondary"
import { useRoles } from "@/hooks/use-roles"
import { useNavigationStore } from "@/lib/stores/navigation"
import { getMainNavItems } from "@/lib/config/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavMainItem } from "@/lib/types/navigation"
import Link from "next/link"
import Image from "next/image"

type AppSidebarProps = {
  user: {
    roles: {
      role: {
        name: string
        permissions: {
          permission: Permission
        }[]
      }
    }[]
  }
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const { t } = useTranslation();
  const { roles, loading, error } = useRoles();
  const { visibleMainItems } = useNavigationStore();
  const [mainNavItems, setMainNavItems] = useState<NavMainItem[]>([]);

  const roleName = user.roles[0]?.role.name || "User";

  useEffect(() => {
    if (loading) return;

    if (error) {
      console.error("Error loading roles:", error);
      return;
    }

    // Use the centralized helper function to get the main navigation items.
    const transformedItems = getMainNavItems(user, roles, t);
    // Optionally, if you still want to filter by visibleMainItems from your store,
    // you can do so here. For example:
    const filteredItems =
      visibleMainItems && visibleMainItems.length > 0
        ? transformedItems.filter((item) => visibleMainItems.includes(item.id))
        : transformedItems;
    setMainNavItems(filteredItems.filter((item) => !item.hidden));
  }, [visibleMainItems, user, roles, loading, error, t]);

  // For project navigation, here we assume notifications is the only project nav.
  const visibleProjectNav = [
    {
      title: t("notifications"),
      url: "notifications",
      icon: (Icons.fileText) as LucideIcon,
    },
  ];

  if (loading)
    return <p className="p-4 text-center text-sm">Loading sidebar...</p>;
  if (error)
    return (
      <p className="p-4 text-center text-sm text-red-500">
        Error loading sidebar
      </p>
    );

  return (
    <Sidebar variant="inset" {...props} className="border border-border p-0">
      <SidebarHeader className="border-b p-4 duration-300">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard" className="flex items-center gap-3">
                <Image
                  src="/images/new.png"
                  alt="Logo"
                  width={45}
                  height={45}
                  priority
                  className="rounded-full flex-shrink-0"
                />
                <div className="flex-1 overflow-hidden">
                  <span className="block font-semibold text-muted-foreground leading-normal break-words max-h-16 overflow-auto">
                    Legazpi City Civil Registry
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <div className="p-4 border-b bg-muted/50">
        <div className="text-sm text-left font-medium capitalize">
          {t(roleName)} {t("panel")}
        </div>
      </div>

      <SidebarContent>
        <NavMain items={mainNavItems} />
        <NavProjects items={visibleProjectNav} />
        <NavSecondary items={[]} className="mt-auto" />
      </SidebarContent>
    </Sidebar>
  );
}
