import { Skeleton } from "@/components/ui/skeleton";

export const SectionSkeleton = () => {
  return (
    <div className="bg-slate-100 rounded-md space-y-3 mt-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} className="h-8 w-full bg-slate-200" />
      ))}
    </div>
  );
};
