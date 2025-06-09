import { db } from "@/lib/db";
import ReviewCoursesTable from "./_components/review-courses-table";
import { Course } from ".prisma/client";

export type CourseWithUserEmail = Course & { user: { email: string | null } };

export default async function ReviewCoursesPage() {
  const data = (await db.course.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          email: true,
        },
      },
    },
  })) as CourseWithUserEmail[];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Review Courses</h1>
      </div>
      <ReviewCoursesTable data={data} />
    </div>
  );
}
