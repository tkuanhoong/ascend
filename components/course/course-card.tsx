import { Card, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Link from "next/link";
import { formattedToMYR } from "@/lib/currency";
import { CourseProgress } from "./course-progress,";
import { Badge } from "@/components/ui/badge";
import { CourseWithProgressWithCategory } from "@/data/course/get-home-courses";

interface CourseCardProps {
  course: CourseWithProgressWithCategory;
  progress: number | null;
}

export const CourseCard = ({ course, progress }: CourseCardProps) => {
  const courseDetailsLink = `/courses/${course.id}`;
  return (
    <Link href={courseDetailsLink}>
      <Card className="h-full">
        <CardHeader className="p-0">
          <AspectRatio ratio={16 / 9}>
            <Image
              src={course.imageUrl!}
              alt="Course Image"
              fill
              className="h-full w-full rounded-t object-cover"
            />
          </AspectRatio>
        </CardHeader>
        <div className="flex items-center py-4 px-2">
          <div className="flex flex-1">
            <p className="text-sm font-semibold line-clamp-1 overflow-ellipsis">
              {course.title}
            </p>
          </div>
          <Badge>{course.category?.name}</Badge>
        </div>
        <div className="px-2 pb-2 space-y-2">
          {progress !== null ? (
            <CourseProgress
              variant={progress === 100 ? "success" : "default"}
              size="sm"
              value={progress}
            />
          ) : (
            <p className="text-md md:text-sm font-medium text-slate-700 ml-auto">
              {formattedToMYR(course.price ?? 0)}
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
};
