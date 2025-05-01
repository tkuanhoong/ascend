import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 py-2 max-h-svh">
      <div>
        <Skeleton className="h-8 w-48" />
      </div>
      <Skeleton className="h-8 max-w-sm py-4" />
      <Skeleton className="min-h-[100vh] md:min-h-min flex-1 w-full" />
    </div>
  );
}
