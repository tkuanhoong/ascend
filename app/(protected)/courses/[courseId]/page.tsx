import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { getCourseById } from "@/data/course/get-course-by-id";
import { formattedToMYR } from "@/lib/currency";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function CourseDetailsPage({
  params,
}: {
  params: { courseId: string };
}) {
  // return <CourseDetailsPageSkeleton />;
  const { courseId } = await params;
  const course = await getCourseById(courseId);
  if (!course) {
    redirect("/");
  }
  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course Image and Details (Left + Middle columns) */}
        <div className="lg:col-span-2 bg-white rounded-lg overflow-hidden shadow">
          <AspectRatio ratio={16 / 9}>
            <Image
              src={course.imageUrl!}
              alt="Course Image"
              fill
              className="h-full w-full rounded-t object-cover"
            />
          </AspectRatio>

          <div className="p-6">
            <div className="flex justify-between">
              <h1 className="text-2xl font-bold text-gray-900 mb-2 truncate">
                {course.title}
              </h1>
              <h1 className="text-xl font-semibold">
                {formattedToMYR(course.price ?? NaN)}
              </h1>
            </div>
            <h1 className="text-lg font-bold text-gray-900 mb-2">
              Course Description
            </h1>
            <p>{course.description}</p>
          </div>
        </div>

        {/* Purchase Card (Right column) */}
        <div className="flex flex-col bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold">Purchase this course?</h2>
          <p className="text-gray-600">
            You will get access to all of the chapters.
          </p>

          <Button className="font-medium">Purchase</Button>
          <Button variant="outline" className="font-medium">
            Preview free chapters
          </Button>
        </div>
      </div>
    </div>
  );
}
