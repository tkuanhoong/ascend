import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { LearningDashboardSidebar } from "./_components/learning-dashboard-sidebar";
import { redirect } from "next/navigation";
import { currentUserId } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Undo2 } from "lucide-react";
import Link from "next/link";
import { CourseProgress } from "@/components/course/course-progress,";
import { ViewCertificateButton } from "./_components/view-certificate-button";
import { getLearningDashboardData } from "@/data/course/get-learning-dashhboard-data";

export default async function ChapterPageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ courseId: string; chapterId: string }>;
}) {
  const { courseId } = await params;
  const userId = await currentUserId();
  if (!userId) {
    redirect("/");
  }

  const { user, isPurchased, isCourseCompleted, course, progress } =
    await getLearningDashboardData({
      courseId,
      userId,
    });

  if (!user || !user.name || !user.identificationNo || !course) {
    redirect("/");
  }

  const { name, identificationNo } = user;

  return (
    <SidebarProvider>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 sticky z-50 top-0 bg-white">
          <h1 className="text-xl font-semibold">{course.title}</h1>
          <div className="ml-auto flex items-center space-x-2">
            {isPurchased && (
              <div className="flex items-center space-x-3">
                <CourseProgress
                  variant={progress === 100 ? "success" : "default"}
                  size="sm"
                  value={progress}
                />
                {isCourseCompleted && (
                  <ViewCertificateButton
                    recipientName={name}
                    courseName={course.title}
                    identificationNo={identificationNo}
                  />
                )}
              </div>
            )}
            <Button variant="outline" asChild>
              <Link href="/">
                <Undo2 /> Exit
              </Link>
            </Button>
            <SidebarTrigger className="-mr-1 rotate-180" />
          </div>
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
