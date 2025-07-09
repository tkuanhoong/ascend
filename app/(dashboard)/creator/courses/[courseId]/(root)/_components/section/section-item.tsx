"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { SectionItemContent } from "./section-item-content";
import { ItemProps } from "@/components/dnd-kit/types";
import { SectionWithChapterCount } from "@/types/section";

export const SectionItem = forwardRef<
  HTMLDivElement,
  ItemProps<SectionWithChapterCount>
>(({ data, id, ...props }, ref) => {
  return (
    <div
      {...props}
      ref={ref}
      id={id}
      className={cn(
        "flex p-1 rounded-sm items-center bg-slate-200 cursor-move",
        props.className
      )}
    >
      <SectionItemContent data={data} />
    </div>
  );
});

SectionItem.displayName = "SectionItem";
