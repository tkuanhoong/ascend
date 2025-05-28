"use client";

import { Chapter } from ".prisma/client";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { ChapterItemContent } from "./chapter-item-content";
import { ItemProps } from "@/components/dnd-kit/types";

export const ChapterItem = forwardRef<HTMLDivElement, ItemProps<Chapter>>(
  ({ data, id, ...props }, ref) => {
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
        <ChapterItemContent data={data} />
      </div>
    );
  }
);

ChapterItem.displayName = "SectionItem";
