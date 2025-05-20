import { currentUserId } from "@/lib/auth";
import { CourseSection } from "./_components";
import { getPurchasedCourses } from "@/data/course/get-purchased-courses";
import { redirect } from "next/navigation";

export default async function PurechasedCoursePage() {
  const userId = await currentUserId();
  if (!userId) {
    redirect("/");
  }
  const { completedCourses, coursesInProgress } = await getPurchasedCourses(
    userId
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Learning</h1>

      <CourseSection courses={coursesInProgress} progressLabel="In Progress" />

      <CourseSection courses={completedCourses} progressLabel="Completed" />
    </div>
  );
}
