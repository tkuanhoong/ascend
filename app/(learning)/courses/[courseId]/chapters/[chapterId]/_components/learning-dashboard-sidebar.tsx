"use client";
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import { Chapter, Section } from "@/prisma/app/generated/prisma/client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

type SectionWithChapters = Section & {
  chapters: Chapter[];
};

interface LearningDashboardSidebarProps
  extends React.ComponentProps<typeof Sidebar> {
  sections: SectionWithChapters[];
}

export function LearningDashboardSidebar({
  sections,
  ...props
}: LearningDashboardSidebarProps) {
  const { courseId, chapterId } = useParams();
  const { isMobile, toggleSidebar } = useSidebar();
  return (
    <Sidebar {...props}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Table of Contents</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sections.map((section) => (
                <Collapsible
                  key={section.id}
                  title={section.title}
                  defaultOpen
                  className="group/collapsible"
                >
                  <SidebarGroup>
                    <SidebarGroupLabel
                      asChild
                      className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    >
                      <CollapsibleTrigger>
                        <p className="truncate">{section.title}</p>
                        <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                      </CollapsibleTrigger>
                    </SidebarGroupLabel>
                    <CollapsibleContent>
                      <SidebarGroupContent>
                        <SidebarMenu>
                          {section.chapters.map((chapter) => (
                            <SidebarMenuItem key={chapter.title}>
                              <SidebarMenuButton
                                asChild
                                isActive={chapter.id === chapterId}
                                onClick={() => isMobile && toggleSidebar()}
                              >
                                <Link
                                  href={`/courses/${courseId}/chapters/${chapter.id}`}
                                >
                                  {chapter.title}
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          ))}
                        </SidebarMenu>
                      </SidebarGroupContent>
                    </CollapsibleContent>
                  </SidebarGroup>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
