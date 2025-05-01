import { ModalContext } from "@/context";
import { ReactNode, useState } from "react";

export const ModalContextProvider = ({ children }: { children: ReactNode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const value = { isModalOpen, setIsModalOpen };

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};
