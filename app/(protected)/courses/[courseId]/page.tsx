import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { formattedToMYR } from "@/lib/currency";
import Image from "next/image";
import { redirect } from "next/navigation";
import PurchaseCourseButton from "./_components/purchase-course-button";
import { currentUserId } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getCourseDetailsContent } from "@/data/course/get-course-details-content";
import { CourseStatus } from "@prisma/client";

export default async function CourseDetailsPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const userId = await currentUserId();
  if (!userId) {
    redirect("/");
  }
  const { course, isAdmin, hasPreviewAccess, purchase } =
    await getCourseDetailsContent({ userId, courseId });

  if (!course || !course.price || !course.imageUrl) {
    redirect("/");
  }

  const firstSection = course.sections[0];
  const firstChapter = firstSection?.chapters[0];
  const firstChapterLink = `/courses/${course.id}/chapters/${firstChapter.id}`;

  const hasFreeChapter = course.sections
    .flatMap((section) => section.chapters)
    .some((chapter) => chapter.isFree);

  const publishedCourse = course.status === CourseStatus.PUBLISHED;
  const unpublishedCourseButPurchased =
    course.status === CourseStatus.UNPUBLISHED && purchase;

  const validCourseAccess =
    hasPreviewAccess || publishedCourse || unpublishedCourseButPurchased;

  if (!validCourseAccess) {
    redirect("/");
  }

  if (purchase) {
    redirect(firstChapterLink);
  }

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course Image and Details (Left + Middle columns) */}
        <div className="lg:col-span-2 bg-white rounded-lg overflow-hidden shadow">
          <AspectRatio ratio={16 / 9}>
            <Image
              src={course.imageUrl}
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
                  {formattedToMYR(course.price)}
                </h1>
              )}
            </div>
            <div className="space-y-4">
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  Course Description
                </h1>
                <p>{course.description}</p>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  Instructor
                </h1>
                <p>{course.user.name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Purchase Card (Right column) */}
        <div className="flex flex-col bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold">Purchase this course?</h2>
          <p className="text-gray-600">
            You will get access to all of the chapters.
          </p>
          {!hasPreviewAccess && (
            <PurchaseCourseButton courseId={course.id} price={course.price} />
          )}
          {(hasFreeChapter || hasPreviewAccess) && (
            <Button variant="outline" className="font-medium" asChild>
              <Link href={firstChapterLink}>
                {hasPreviewAccess
                  ? isAdmin
                    ? "Preview as Admin"
                    : "Preview as Course Owner"
                  : "Preview free chapters"}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
