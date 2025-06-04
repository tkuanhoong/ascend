import { AlertBanner } from "@/components/course/alert-banner";
import { EditableContextProvider } from "@/components/providers/editable-context-provider";
import { getCourseById } from "@/data/course/get-course-by-id";
import { CourseStatus } from "@prisma/client";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function CoursePageLayout({
  params,
  children,
}: {
  params: Promise<{ courseId: string }>;
  children: ReactNode;
}) {
  const { courseId } = await params;
  const course = await getCourseById(courseId);
  if (!course) {
    redirect("/creator/courses");
  }

  const isEditable = course.status !== CourseStatus.PENDING;
  return (
    <EditableContextProvider defaultValue={isEditable}>
      {course.status === CourseStatus.PENDING && (
        <AlertBanner label="The course is pending review and cannot be modified." />
      )}
      {course.status === CourseStatus.REJECTED && (
        <AlertBanner
          label="The course is rejected by admin."
          variant="danger"
          reason={course.reason}
        />
      )}
      {course.status === CourseStatus.REVOKED && (
        <AlertBanner
          label="The course publish status is revoked by admin."
          reason={course.reason}
        />
      )}
      {course.status === CourseStatus.DRAFT && (
        <AlertBanner label="This course is under draft. It will not be visible to students." />
      )}
      {course.status === CourseStatus.PUBLISHED && (
        <AlertBanner
          label="This course is made public to students."
          variant="success"
        />
      )}
      {course.status === CourseStatus.UNPUBLISHED && (
        <AlertBanner label="The course is unpublished. This prevents new students from enrolling the course." />
      )}
      {children}
    </EditableContextProvider>
  );
}
