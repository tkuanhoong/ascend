"use client";

import * as React from "react";
import { BookOpen, GalleryVerticalEnd, PieChart } from "lucide-react";

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
  ],
  // projects: [
  //   {
  //     name: "Design Engineering",
  //     url: "#",
  //     icon: Frame,
  //   },
  //   {
  //     name: "Sales & Marketing",
  //     url: "#",
  //     icon: PieChart,
  //   },
  //   {
  //     name: "Travel",
  //     url: "#",
  //     icon: Map,
  //   },
  // ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const currentUser = useCurrentUser();
  if (!currentUser) {
    return null;
  }
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <OrganisationLogo organisation={data.organisation} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={currentUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
