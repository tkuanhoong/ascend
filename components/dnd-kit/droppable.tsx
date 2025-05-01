"use client";

import { HTMLProps } from "react";
import { useDroppable } from "@dnd-kit/core";

export function Droppable(props: HTMLProps<HTMLElement>) {
  const { isOver, setNodeRef } = useDroppable({
    id: "droppable",
  });
  const style = {
    color: isOver ? "green" : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {props.children}
    </div>
  );
}
