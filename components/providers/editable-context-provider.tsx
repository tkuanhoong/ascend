"use client";

import { EditableContext } from "@/context";
import { ReactNode, useEffect, useState } from "react";

export const EditableContextProvider = ({
  defaultValue,
  children,
}: {
  defaultValue: boolean;
  children: ReactNode;
}) => {
  const [isEditable, setIsEditable] = useState(defaultValue);

  useEffect(() => {
    setIsEditable(defaultValue);
  }, [defaultValue]);

  const value = { isEditable, setIsEditable };

  return (
    <EditableContext.Provider value={value}>
      {children}
    </EditableContext.Provider>
  );
};
