import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { LearningDashboardSidebar } from "./_components/learning-dashboard-sidebar";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { currentUserId } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Undo2 } from "lucide-react";
import Link from "next/link";
import { CourseProgress } from "@/components/course/course-progress,";
import { getCourseProgress } from "@/data/course/get-course-progress";

export default async function ChapterPageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string; chapterId: string };
}) {
  const userId = await currentUserId();
  if (!userId) {
    redirect("/");
  }
  const { courseId } = await params;

  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
  });

  const isPurchased = !!purchase;

  const course = await db.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      sections: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: "asc",
        },
        include: {
          chapters: {
            where: {
              isPublished: true,
            },
            orderBy: {
              position: "asc",
            },
            include: {
              userProgress: {
                where: {
                  userId,
                },
                select: {
                  isCompleted: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const progress = await getCourseProgress({ userId, courseId });

  if (!course) {
    redirect("/");
  }
  return (
    <SidebarProvider>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 sticky z-50 top-0 bg-white">
          <h1 className="text-xl font-semibold">{course.title}</h1>
          {isPurchased && (
            <div className="mx-auto w-full max-w-sm">
              <CourseProgress
                variant={progress === 100 ? "success" : "default"}
                size="sm"
                value={progress}
              />
            </div>
          )}
          <Button variant="outline" className="ml-auto" asChild>
            <Link href="/">
              <Undo2 /> Exit
            </Link>
          </Button>
          <SidebarTrigger className="-mr-1 rotate-180" />
        </header>
        {children}
      </SidebarInset>
      <LearningDashboardSidebar
        sections={course.sections}
        side="right"
        isPurchased={isPurchased}
      />
    </SidebarProvider>
  );
}
