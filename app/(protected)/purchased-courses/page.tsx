import { currentUserId } from "@/lib/auth";
import { CourseSection } from "./_components";
import { db } from "@/lib/db";

export default async function PurechasedCoursePage() {
  // Sample data - replace with actual data from your API/state

  const userId = await currentUserId();
  const courses = await db.course.findMany({
    where: {
      userId,
    },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Learning</h1>

      <CourseSection courses={courses} progressLabel="In Progress" />

      <CourseSection courses={courses} progressLabel="Completed" />
    </div>
  );
}
