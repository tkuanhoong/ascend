"use client";

import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { errorToast, successToast, unexpectedErrorToast } from "@/lib/toast";
import apiClient from "@/lib/axios";
import { ConfirmModal } from "@/components/form/confirm-modal";
import useIsEditable from "@/hooks/use-is-editable";
import { AxiosError } from "axios";

interface SectionActionsProps {
  disabled: boolean;
  courseId: string;
  sectionId: string;
  isPublished: boolean;
}

export const SectionActions = ({
  disabled,
  courseId,
  sectionId,
  isPublished,
}: SectionActionsProps) => {
  const router = useRouter();
  const [isLoading, startTransition] = useTransition();
  const { isEditable } = useIsEditable();

  if (!isEditable) {
    return null;
  }

  const onClick = () => {
    startTransition(async () => {
      try {
        if (isPublished) {
          await apiClient.patch(
            `/api/courses/${courseId}/sections/${sectionId}/unpublish`
          );
          successToast({ message: "Section unpublished" });
        } else {
          await apiClient.patch(
            `/api/courses/${courseId}/sections/${sectionId}/publish`
          );
          successToast({ message: "Section published" });
        }
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
    });
  };

  const onDelete = () => {
    startTransition(async () => {
      try {
        await apiClient.delete(
          `/api/courses/${courseId}/sections/${sectionId}`
        );
        successToast({ message: "Section deleted" });
        router.refresh();
        router.push(`/creator/courses/${courseId}`);
      } catch (error) {
        if (error instanceof AxiosError) {
          errorToast({
            message: error.response?.data?.error || "An error occurred",
          });
        } else {
          unexpectedErrorToast();
        }
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
        title="Confirm to delete this section?"
        desc="This action cannot be undone. This will permanently delete the
            section and remove your data from our servers."
      >
        <Button size="sm" disabled={isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};
