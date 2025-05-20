"use client";

import * as React from "react";
import {
  BookOpen,
  DatabaseBackup,
  Frame,
  GalleryVerticalEnd,
  PieChart,
} from "lucide-react";

import { NavMain } from "@/components/dashboard/nav-main";
import { NavUser } from "@/components/dashboard/nav-user";
import { OrganisationLogo } from "@/components/dashboard/organisation-logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { NavAdmin } from "./nav-admin";
import { redirect } from "next/navigation";
import { useCurrentRole } from "@/hooks/use-current-role";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  organisation: {
    name: "Ascend",
    logo: GalleryVerticalEnd,
    slogan: "Create your course",
  },
  navMain: [
    {
      title: "Analytics Dashboard",
      url: "/creator/analytics",
      icon: PieChart,
    },
    {
      title: "Manage Courses",
      url: "/creator/courses",
      icon: BookOpen,
    },
    {
      title: "Course Backup Files",
      url: "/creator/backups",
      icon: DatabaseBackup,
    },
  ],
  navAdmin: [
    {
      title: "Analytics Dashboard (Admin)",
      url: "/admin/analytics",
      icon: Frame,
    },
    {
      title: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      title: "Travel",
      url: "#",
      icon: PieChart,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const currentUser = useCurrentUser();
  const { isAdmin } = useCurrentRole();
  if (!currentUser) {
    redirect("/");
  }
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <OrganisationLogo organisation={data.organisation} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {isAdmin && <NavAdmin items={data.navAdmin} />}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={currentUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
