"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SectionItem } from "./section-item";
import { Section } from "@/prisma/app/generated/prisma/client";
import { SortableItemProps } from "@/components/dnd-kit/types";

export function SortableSectionItem({ data }: SortableItemProps<Section>) {
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
