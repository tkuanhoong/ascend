"use client";

import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { successToast, unexpectedErrorToast } from "@/lib/toast";
import apiClient from "@/lib/axios";
import { ConfirmModal } from "@/components/form/confirm-modal";
import useIsEditable from "@/hooks/use-is-editable";

interface ChapterActionsProps {
  disabled: boolean;
  isPublished: boolean;
}

export const ChapterActions = ({
  disabled,
  isPublished,
}: ChapterActionsProps) => {
  const router = useRouter();
  const [isLoading, startTransition] = useTransition();
  const { courseId, sectionId, chapterId } = useParams();
  const { isEditable } = useIsEditable();

  if (!isEditable) {
    return null;
  }

  const apiRoute = `/api/courses/${courseId}/sections/${sectionId}/chapters/${chapterId}`;

  const onClick = () => {
    startTransition(async () => {
      try {
        if (isPublished) {
          await apiClient.patch(`${apiRoute}/unpublish`);
          successToast({ message: "Chapter unpublished" });
        } else {
          await apiClient.patch(`${apiRoute}/publish`);
          successToast({ message: "Chapter published" });
        }
        router.refresh();
      } catch (error) {
        unexpectedErrorToast();
        console.log(error);
      }
    });
  };

  const onDelete = () => {
    startTransition(async () => {
      try {
        await apiClient.delete(apiRoute);
        successToast({ message: "Chapter deleted" });
        router.refresh();
        router.push(`/creator/courses/${courseId}/sections/${sectionId}`);
      } catch (error) {
        unexpectedErrorToast();
        console.log(error);
      }
    });
  };
  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        variant="outline"
        size="sm"
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <ConfirmModal
        onConfirm={onDelete}
        title="Confirm to delete this chapter?"
        desc="This action cannot be undone. This will permanently delete the
            chapter and remove your data from our servers."
      >
        <Button size="sm" disabled={isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};
