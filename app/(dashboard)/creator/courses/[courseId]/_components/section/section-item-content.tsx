"use client";

import { ConfirmModal } from "@/components/form/confirm-modal";
import { Button } from "@/components/ui/button";
import { Section } from "@/prisma/app/generated/prisma/client";
import { GripVertical, Pencil, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { ShowingConfirmModalContext } from "./section-form";

export const SectionItemContent = ({ data }: { data: Section | undefined }) => {
  const router = useRouter();
  const { setIsShowingConfirmModal } = useContext(ShowingConfirmModalContext);
  const onEdit = () => {
    router.push(`/creator/courses/${courseId}/sections/${id}`);
  };

  const onDelete = () => {};

  if (!data) {
    return null;
  }

  const { id, title, courseId } = data;

  return (
    <>
      <div className="flex items-center">
        <div>
          <GripVertical />
        </div>
        <div className="max-w-full md:max-w-20 lg:max-w-full">
          <p className="text-medium overflow-ellipsis line-clamp-1 break-words">
            {title}
          </p>
        </div>
      </div>
      <div className="flex ml-auto">
        <Button variant="ghost" className="lg:p-4 p-2" onClick={onEdit}>
          <Pencil className="size-4" />
        </Button>
        <ConfirmModal
          onConfirm={onDelete}
          title="Confirm to delete this section?"
          desc="This action cannot be undone. This will permanently delete the
            section and remove your data from our servers."
          onOpenChange={(open) => {
            setIsShowingConfirmModal(open);
          }}
        >
          <Button
            variant="ghost"
            className="lg:p-4 p-2"
            onClick={() => {
              console.log("clicked");
            }}
          >
            <X className="size-4" />
          </Button>
        </ConfirmModal>
      </div>
    </>
  );
};
