"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";

const progressVariants = cva("h-full w-full flex-1 bg-primary transition-all", {
  variants: {
    variant: {
      default: "bg-indigo-500",
      success: "bg-emerald-500",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});
export interface ProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressVariants> {}

type CombinedProgressProps = ProgressProps &
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>;

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  CombinedProgressProps
>(({ className, value, variant, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(progressVariants({ variant }))}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
