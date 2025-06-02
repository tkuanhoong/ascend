import { createContext, SetStateAction } from "react";

export const EditableContext = createContext<{
  isEditable: boolean;
  setIsEditable: React.Dispatch<SetStateAction<boolean>>;
}>({
  isEditable: false,
  setIsEditable: () => {},
});
