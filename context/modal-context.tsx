import { createContext, SetStateAction } from "react";

export const ModalContext = createContext<{
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<SetStateAction<boolean>>;
}>({
  isModalOpen: false,
  setIsModalOpen: () => {},
});
