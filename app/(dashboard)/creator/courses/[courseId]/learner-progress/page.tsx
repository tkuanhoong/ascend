import { DataTable } from "@/components/data-table/custom-data-table";
import { getLearnerProgressList } from "@/data/course/get-learner-progress-list";
import { columns } from "./_components/columns";
import { getCourseById } from "@/data/course/get-course-by-id";
import { redirect } from "next/navigation";

export default async function LearnerProgressPage({
  params,
}: {
  params: { courseId: string };
}) {
  const { courseId } = await params;

  const course = await getCourseById(courseId);

  if (!course) {
    redirect("/creator/courses/");
  }

  const data = await getLearnerProgressList(courseId);

  const options = {
    filterColumn: "email",
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 py-2">
      <div>
        <h1 className="text-2xl font-semibold">{`Learning Progress for ${course.title}`}</h1>
      </div>
      <DataTable columns={columns} data={data} {...options} />
    </div>
  );
}
