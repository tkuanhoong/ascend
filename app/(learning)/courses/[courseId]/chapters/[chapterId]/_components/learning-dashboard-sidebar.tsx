"use client";

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
import { Chapter, Section } from "@/generated/prisma";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatMinutes } from "@/lib/format";

type ChapterWithUserProgress = Chapter & {
  userProgress: { isCompleted: boolean }[];
};

type SectionWithChapters = Section & {
  chapters: ChapterWithUserProgress[];
};

interface LearningDashboardSidebarProps
  extends React.ComponentProps<typeof Sidebar> {
  sections: SectionWithChapters[];
  isPurchased: boolean;
}

export function LearningDashboardSidebar({
  sections,
  isPurchased,
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
                      <CollapsibleTrigger className="h-full">
                        <div className="flex flex-col items-start">
                          <div className="flex items-center space-x-2">
                            <p className="text-ellipsis line-clamp-1 text-left font-semibold">
                              {section.title}
                            </p>
                            <Badge>{section.level}</Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatMinutes(section.estimatedTime!)}
                          </div>
                        </div>
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
                                  <p className="truncate">{chapter.title}</p>
                                  {!isPurchased ? (
                                    <>
                                      {chapter.isFree ? (
                                        <Badge>Free</Badge>
                                      ) : (
                                        <Badge>Paid</Badge>
                                      )}
                                    </>
                                  ) : (
                                    <>
                                      {chapter.userProgress[0] &&
                                        chapter.userProgress[0].isCompleted && (
                                          <Badge variant="success">
                                            Completed
                                          </Badge>
                                        )}
                                    </>
                                  )}
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
