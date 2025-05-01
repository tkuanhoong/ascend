import { Card, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Link from "next/link";

interface CourseCardProps {
  href?: string;
}

export const CourseCard = ({ href = "/" }: CourseCardProps) => {
  return (
    <Link href={href}>
      <Card>
        <CardHeader className="p-0">
          <AspectRatio ratio={16 / 9}>
            <Image
              src="https://img.freepik.com/free-photo/young-woman-attending-online-class_23-2148854935.jpg?semt=ais_hybrid"
              alt="Course Image"
              fill
              className="h-full w-full rounded-t object-cover"
            />
          </AspectRatio>
        </CardHeader>
        <div className="flex items-center py-4 px-2">
          <div className="flex-1 flex-col">
            <p className="text-sm font-semibold">Course title</p>
          </div>
          <div>
            <p className="text-sm">RM 100.00</p>
          </div>
        </div>
      </Card>
    </Link>
  );
};
