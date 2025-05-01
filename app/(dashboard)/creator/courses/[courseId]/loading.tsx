import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-8 rounded-full" />
            <Skeleton className="h-6 w-40" />
          </div>
          <div className="space-y-4 mt-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-20 w-full" />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-8 rounded-full" />
            <Skeleton className="h-6 w-40" />
          </div>
          <div className="space-y-4 mt-4">
            <Skeleton className="h-20 w-full" />
            <div>
              <div className="flex items-center gap-x-2">
                <Skeleton className="size-8 rounded-full" />
                <Skeleton className="h-6 w-40" />
              </div>
              <Skeleton className="h-20 w-full mt-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
