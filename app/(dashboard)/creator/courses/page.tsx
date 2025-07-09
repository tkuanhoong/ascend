import { DataTable } from "@/components/data-table/custom-data-table";
import { columns } from "./_components/columns";
import { currentUserId } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCreatorCourses } from "@/data/course/get-creator-courses";

export default async function CoursesPage() {
  const userId = await currentUserId();
  if (!userId) {
    redirect("/");
  }
  const data = await getCreatorCourses(userId);

  const options = {
    filterColumn: "title",
    createButtonHref: "/creator/courses/create",
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 py-2">
      <div>
        <h1 className="text-2xl font-semibold">Manage Courses</h1>
      </div>
      <DataTable columns={columns} data={data} {...options} />
    </div>
  );
}
