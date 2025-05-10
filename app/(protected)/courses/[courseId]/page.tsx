import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
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

  const course = await db.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      sections: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: "asc",
        },
        select: {
          chapters: {
            select: {
              id: true,
              title: true,
              isFree: true,
            },
            where: {
              isPublished: true,
            },
            orderBy: {
              position: "asc",
            },
          },
        },
      },
    },
  });

  if (!course || !user || !course.price) {
    redirect("/");
  }

  const firstSection = course.sections[0];

  const firstChapter = firstSection?.chapters[0];

  const hasFreeChapter = course.sections
    .flatMap((section) => section.chapters)
    .some((chapter) => chapter.isFree);

  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: courseId,
      },
    },
  });

  if (purchase) {
    redirect(`/courses/${course.id}/chapters/${firstChapter.id}`);
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
          <h2 className="text-xl font-semibold">Purchase this course?</h2>
          <p className="text-gray-600">
            You will get access to all of the chapters.
          </p>

          <PurchaseCourseButton courseId={course.id} price={course.price} />
          {hasFreeChapter && (
            <Button variant="outline" className="font-medium" asChild>
              <Link href={`/courses/${course.id}/chapters/${firstChapter.id}`}>
                Preview free chapters
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
