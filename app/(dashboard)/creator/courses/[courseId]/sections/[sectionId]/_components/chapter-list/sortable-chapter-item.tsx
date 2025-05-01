"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChapterItem } from "./chapter-item";
import { Chapter } from "@/prisma/app/generated/prisma/client";
import { SortableItemProps } from "@/components/dnd-kit/types";

export function SortableChapterItem({ data }: SortableItemProps<Chapter>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: data.id, data });

  const style = {
    opacity: isDragging ? 0.4 : 1,
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: "none",
  };

  return (
    <ChapterItem
      data={data}
      id={data.id}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    />
  );
}
