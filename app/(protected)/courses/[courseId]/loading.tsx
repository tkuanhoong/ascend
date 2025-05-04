import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";

export default async function CourseDetailsPageSkeleton() {
  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course Image and Details Skeleton (Left + Middle columns) */}
        <div className="lg:col-span-2 bg-white rounded-lg overflow-hidden shadow">
          <AspectRatio ratio={16 / 9}>
            <Skeleton className="h-full w-full rounded-t" />
          </AspectRatio>

          <div className="p-6">
            <div className="flex justify-between">
              <Skeleton className="h-6 w-1/2 mb-2" />
              <Skeleton className="h-6 w-1/4" />
            </div>
            <Skeleton className="h-6 w-1/3 mb-2" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>

        {/* Purchase Card Skeleton (Right column) */}
        <div className="flex flex-col bg-white rounded-lg shadow p-6 space-y-4">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  );
}
