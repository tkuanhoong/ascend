"use client";

import { ConfirmModal } from "@/components/form/confirm-modal";
import { Button } from "@/components/ui/button";
import { Chapter } from "@/prisma/app/generated/prisma/client";
import { GripVertical, Pencil, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import useIsModalOpen from "@/hooks/use-is-modal-open";
import { successToast, unexpectedErrorToast } from "@/lib/toast";
import apiClient from "@/lib/axios";

export const ChapterItemContent = ({ data }: { data: Chapter | undefined }) => {
  const router = useRouter();
  const { courseId } = useParams();
  const { setIsModalOpen } = useIsModalOpen();
  if (!data) {
    return null;
  }

  const { id, title, sectionId } = data;
  const onEdit = () => {
    router.push(
      `/creator/courses/${courseId}/sections/${sectionId}/chapters/${id}`
    );
  };

  const onDelete = async () => {
    try {
      await apiClient.delete(
        `/api/courses/${courseId}/sections/${sectionId}/chapters/${id}`
      );
      successToast({ message: "Chapter deleted" });
      router.refresh();
    } catch (error) {
      unexpectedErrorToast();
      console.log(error);
    }
  };

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
          title="Confirm to delete this chapter?"
          desc="This action cannot be undone. This will permanently delete the
            chapter and remove your data from our servers."
          onOpenChange={(open) => {
            setIsModalOpen(open);
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
