import { DataTable } from "@/components/data-table/custom-data-table";
import { columns } from "./_components/columns";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Category, Course } from "@/prisma/app/generated/prisma/client";

export type CourseWithCategory = Course & { category: Category | null };

async function getData(): Promise<CourseWithCategory[]> {
  const user = await currentUser();
  if (!user) {
    redirect("/");
  }
  const { id: userId } = user;
  // Fetch data from API here.
  const courses = db.course.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      category: true,
    },
  });
  return courses;
}

export default async function CoursesPage() {
  const data = await getData();

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
