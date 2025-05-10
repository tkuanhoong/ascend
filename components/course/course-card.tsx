import { Card, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Link from "next/link";
import { Course } from "@/prisma/app/generated/prisma/client";
import { formattedToMYR } from "@/lib/currency";

interface CourseCardProps {
  course: Course;
}

export const CourseCard = ({ course }: CourseCardProps) => {
  const courseDetailsLink = `/courses/${course.id}`;
  return (
    <Link href={courseDetailsLink}>
      <Card>
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
          <div className="flex-1 flex-col">
            <p className="text-sm font-semibold line-clamp-1 overflow-ellipsis">
              {course.title}
            </p>
          </div>
          <div>
            <p className="text-sm">{formattedToMYR(course.price ?? 0)}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
};
