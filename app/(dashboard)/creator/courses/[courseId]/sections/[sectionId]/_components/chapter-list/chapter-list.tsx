"use client";

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import { ChapterItem } from "./chapter-item";
import { SortableChapterItem } from "./sortable-chapter-item";
import useIsModalOpen from "@/hooks/use-is-modal-open";
import { Chapter } from ".prisma/client";
import type { SortableListAreaProps } from "@/components/dnd-kit/types";

export const ChapterList = ({
  onReorder,
  items,
}: SortableListAreaProps<Chapter>) => {
  const [isMounted, setIsMounted] = useState(false);
  const [activeId, setActiveId] = useState<string | undefined>(undefined);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const { isModalOpen } = useIsModalOpen();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    setChapters(items);
  }, [items]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="bg-slate-100 rounded-md space-y-3">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        id="chapter-list"
      >
        <SortableContext
          items={chapters}
          strategy={verticalListSortingStrategy}
          disabled={isModalOpen}
        >
          {chapters.map((chapter) => (
            <SortableChapterItem key={chapter.id} data={chapter} />
          ))}
        </SortableContext>
        <DragOverlay
          dropAnimation={{
            duration: 500,
            easing: "ease-in-out",
          }}
        >
          {activeId ? (
            <ChapterItem
              data={
                chapters.find((chapter) => chapter.id === activeId) ?? undefined
              }
              id={activeId}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      try {
        const oldIndex = chapters.findIndex((item) => item.id === active.id);
        const newIndex = chapters.findIndex((item) => item.id === over.id);
        const updatedChapters = arrayMove(chapters, oldIndex, newIndex);
        setChapters(updatedChapters);

        const bulkUpdateData = updatedChapters.map((chapter, index) => ({
          id: chapter.id,
          position: index + 1,
        }));
        onReorder(bulkUpdateData);
      } catch (error) {
        console.log(error);
      }
    }
  }

  function handleDragStart(event: DragEndEvent) {
    const { active } = event;

    setActiveId(active.id.toString());
  }
};
