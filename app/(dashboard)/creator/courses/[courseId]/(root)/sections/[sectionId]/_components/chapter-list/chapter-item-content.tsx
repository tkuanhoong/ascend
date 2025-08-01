"use client";

import { ConfirmModal } from "@/components/form/confirm-modal";
import { Button } from "@/components/ui/button";
import { Chapter } from ".prisma/client";
import { Eye, GripVertical, Pencil, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import useIsModalOpen from "@/hooks/use-is-modal-open";
import { errorToast, successToast, unexpectedErrorToast } from "@/lib/toast";
import apiClient from "@/lib/axios";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import useIsEditable from "@/hooks/use-is-editable";
import { AxiosError } from "axios";

export const ChapterItemContent = ({ data }: { data: Chapter | undefined }) => {
  const { isEditable } = useIsEditable();
  const router = useRouter();
  const { courseId } = useParams();
  const { setIsModalOpen } = useIsModalOpen();
  if (!data) {
    return null;
  }

  const { id, title, sectionId, isPublished, isFree } = data;
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
      if (error instanceof AxiosError) {
        errorToast({
          message: error.response?.data?.error || "An error occurred",
        });
      } else {
        unexpectedErrorToast();
      }
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
        <div className="flex gap-x-1">
          <Badge
            className={cn("bg-slate-500 my-2", isPublished && "bg-indigo-700")}
          >
            {isPublished ? "Published" : "Draft"}
          </Badge>
          <Badge className={cn("bg-slate-500 my-2", isFree && "bg-indigo-700")}>
            {isFree ? "Free" : "Paid"}
          </Badge>
        </div>
        <Button variant="ghost" className="lg:p-4 p-2" onClick={onEdit}>
          {isEditable ? (
            <Pencil className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
        </Button>
        {isEditable && (
          <ConfirmModal
            onConfirm={onDelete}
            title="Confirm to delete this chapter?"
            desc="This action cannot be undone. This will permanently delete the
            chapter and remove your data from our servers."
            onOpenChange={(open) => {
              setIsModalOpen(open);
            }}
          >
            <Button variant="ghost" className="lg:p-4 p-2">
              <X className="size-4" />
            </Button>
          </ConfirmModal>
        )}
      </div>
    </>
  );
};
