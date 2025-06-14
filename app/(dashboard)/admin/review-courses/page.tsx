import ReviewCoursesTable from "./_components/review-courses-table";
import { Course } from ".prisma/client";
import { getCoursesToReview } from "@/data/course/get-courses-to-review";

export type CourseWithUserEmail = Course & { user: { email: string | null } };

export default async function ReviewCoursesPage() {
  const data = await getCoursesToReview();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Review Courses</h1>
      </div>
      <ReviewCoursesTable data={data} />
    </div>
  );
}
