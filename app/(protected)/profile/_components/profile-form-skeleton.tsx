"use client";

import { Skeleton } from "@/components/ui/skeleton";

export const ProfileAccountFormSkeleton = () => {
  return (
    <div className="space-y-2">
      {/* Full Name Skeleton */}
      <div className="space-y-1">
        <Skeleton className="h-4 w-1/3 rounded-md" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>

      {/* Identification Number Skeleton */}
      <div className="space-y-1">
        <Skeleton className="h-4 w-1/3 rounded-md" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>

      {/* Email Address Skeleton */}
      <div className="space-y-1">
        <Skeleton className="h-4 w-1/3 rounded-md" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>

      {/* Save Changes Button Skeleton */}
      <Skeleton className="h-10 w-32 rounded-md" />
    </div>
  );
};
