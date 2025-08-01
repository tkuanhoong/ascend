"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useCurrentRole } from "@/hooks/use-current-role";
import { BreadcrumbItem } from "../ui/breadcrumb";

export default function DashboardHeader() {
  const { isAdmin } = useCurrentRole();
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 sticky z-50 top-0 bg-white">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <BreadcrumbItem>
          {isAdmin ? "Admin Dashboard" : "Creator Dashboard"}
        </BreadcrumbItem>
      </div>
    </header>
  );
}
