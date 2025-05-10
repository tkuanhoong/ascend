import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { getCourseById } from "@/data/course/get-course-by-id";
import { formattedToMYR } from "@/lib/currency";
import Image from "next/image";
import { redirect } from "next/navigation";
import PurchaseCourseButton from "./_components/purchase-course-button";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function CourseDetailsPage({
  params,
}: {
  params: { courseId: string };
}) {
  const user = await currentUser();
  const { courseId } = await params;
  const course = await getCourseById(courseId);

  const firstChapter = await db.chapter.findFirst({
    where: {
      section: {
        courseId,
      },
    },
    select: {
      id: true,
      title: true,
      
    },
  });

  if (!course || !user || !course.price) {
    redirect("/");
  }
  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: courseId,
      },
    },
  });

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
              {purchase ? (
                <Badge>Purchased</Badge>
              ) : (
                <h1 className="text-xl font-semibold">
                  {formattedToMYR(course.price ?? NaN)}
                </h1>
              )}
            </div>
            <h1 className="text-lg font-bold text-gray-900 mb-2">
              Course Description
            </h1>
            <p>{course.description}</p>
          </div>
        </div>

        {/* Purchase Card (Right column) */}
        <div className="flex flex-col bg-white rounded-lg shadow p-6 space-y-4">
          {purchase ? (
            <>
              <h2 className="text-xl font-semibold">
                Congratulations! You have purchased this course!
              </h2>
              <p className="text-gray-600">Access your course now.</p>
              <Button asChild>
                <Link
                  href={`/courses/${courseId}/chapters/${firstChapter?.id}`}
                >
                  View course chapters
                </Link>
              </Button>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold">Purchase this course?</h2>
              <p className="text-gray-600">
                You will get access to all of the chapters.
              </p>

              <PurchaseCourseButton courseId={course.id} price={course.price} />
              <Button variant="outline" className="font-medium">
                Preview free chapters
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
