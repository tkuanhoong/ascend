import { CustomBreadcrumb } from "@/components/custom-breadcrumbs";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { SectionTables } from "./_components/section-data-tables";

const BackupSettingsPage = async ({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) => {
  const { courseId } = await params;

  const course = await db.course.findUnique({
    where: {
      id: courseId,
    },
    select: {
      id: true,
      title: true,
      sections: {
        select: {
          id: true,
          title: true,
          chapters: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
    },
  });

  if (!course) {
    redirect("/creator/courses");
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 py-2">
      <CustomBreadcrumb currentPageLabel="Backup Settings" />
      <div>Course: {course.title}</div>
      <SectionTables courseId={course.id} sections={course.sections} />
    </div>
  );
};

export default BackupSettingsPage;
