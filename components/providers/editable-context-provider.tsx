"use client";

import { EditableContext } from "@/context";
import { ReactNode, useState } from "react";

export const EditableContextProvider = ({
  defaultValue,
  children,
}: {
  defaultValue?: boolean;
  children: ReactNode;
}) => {
  const [isEditable, setIsEditable] = useState(defaultValue ?? false);

  const value = { isEditable, setIsEditable };

  return (
    <EditableContext.Provider value={value}>
      {children}
    </EditableContext.Provider>
  );
};
