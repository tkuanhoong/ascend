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
import { SectionItem } from "./section-item";
import { SortableSectionItem } from "./sortable-section-item";
import useIsModalOpen from "@/hooks/use-is-modal-open";
import { Section } from ".prisma/client";
import type { SortableListAreaProps } from "@/components/dnd-kit/types";

export const SectionList = ({
  onReorder,
  items,
}: SortableListAreaProps<Section>) => {
  const [isMounted, setIsMounted] = useState(false);
  const [activeId, setActiveId] = useState<string | undefined>(undefined);
  const [sections, setSections] = useState<Section[]>([]);
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
    setSections(items);
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
        id="section-list"
      >
        <SortableContext
          items={sections}
          strategy={verticalListSortingStrategy}
          disabled={isModalOpen}
        >
          {sections.map((section) => (
            <SortableSectionItem key={section.id} data={section} />
          ))}
        </SortableContext>
        <DragOverlay
          dropAnimation={{
            duration: 500,
            easing: "ease-in-out",
          }}
        >
          {activeId ? (
            <SectionItem
              data={
                sections.find((section) => section.id === activeId) ?? undefined
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
        const oldIndex = sections.findIndex((item) => item.id === active.id);
        const newIndex = sections.findIndex((item) => item.id === over.id);
        const updatedSections = arrayMove(sections, oldIndex, newIndex);
        setSections(updatedSections);

        const bulkUpdateData = updatedSections.map((section, index) => ({
          id: section.id,
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
