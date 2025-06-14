import { CustomBreadcrumb } from "@/components/custom-breadcrumbs";
import { redirect } from "next/navigation";
import { SectionTables } from "./_components/section-data-tables";
import { getCourseBackupSettings } from "@/data/course/get-course-backup-settings";

const BackupSettingsPage = async ({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) => {
  const { courseId } = await params;

  const course = await getCourseBackupSettings(courseId);

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
