"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SectionItem } from "./section-item";
import { SortableItemProps } from "@/components/dnd-kit/types";
import { SectionWithChapterCount } from "@/types/section";

export function SortableSectionItem({
  data,
}: SortableItemProps<SectionWithChapterCount>) {
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
    <SectionItem
      data={data}
      id={data.id}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    />
  );
}
