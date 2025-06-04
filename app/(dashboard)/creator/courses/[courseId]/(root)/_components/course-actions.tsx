"use client";

import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { successToast, unexpectedErrorToast } from "@/lib/toast";
import apiClient from "@/lib/axios";
import { ConfirmModal } from "@/components/form/confirm-modal";
import { CourseStatus } from ".prisma/client";
import useIsEditable from "@/hooks/use-is-editable";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CourseActionsProps {
  disabled: boolean;
  courseId: string;
  courseStatus: CourseStatus;
  purchaseCount: number;
}

export const CourseActions = ({
  disabled,
  courseId,
  courseStatus,
  purchaseCount,
}: CourseActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { isEditable } = useIsEditable();
  const hasPurchase = !!purchaseCount;

  if (!isEditable) {
    return null;
  }

  const onPublish = async () => {
    try {
      setIsLoading(true);
      await apiClient.patch(`/api/courses/${courseId}/publish`);
      successToast({ message: "Course submitted for review" });
      router.refresh();
    } catch (error) {
      unexpectedErrorToast();
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onUnpublish = async () => {
    try {
      setIsLoading(true);
      await apiClient.patch(`/api/courses/${courseId}/unpublish`);
      successToast({ message: "Course unpublished" });
      router.refresh();
    } catch (error) {
      unexpectedErrorToast();
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await apiClient.delete(`/api/courses/${courseId}`);
      successToast({ message: "Course deleted" });
      router.refresh();
      router.push(`/creator/courses`);
    } catch (error) {
      unexpectedErrorToast();
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-end gap-x-2">
        {courseStatus === CourseStatus.PUBLISHED ? (
          <ConfirmModal
            title="Confirm to Unpublish"
            desc="The course will be unpublished, while enrolled students still can access the course."
            onConfirm={onUnpublish}
          >
            <Button
              disabled={disabled || isLoading}
              variant="outline"
              size="sm"
            >
              Unpublish
            </Button>
          </ConfirmModal>
        ) : (
          <ConfirmModal
            title="Submit course for review"
            desc="The course will be reviewed by admin. Any changes cannot be made while the course is under review."
            onConfirm={onPublish}
          >
            <Button
              disabled={disabled || isLoading}
              variant="outline"
              size="sm"
            >
              Publish
            </Button>
          </ConfirmModal>
        )}

        <ConfirmModal
          onConfirm={onDelete}
          title="Confirm to delete this course?"
          desc="This action cannot be undone. This will permanently delete the
            course and remove your data from our servers."
        >
          <Button size="sm" disabled={isLoading || hasPurchase}>
            <Trash className="h-4 w-4" />
          </Button>
        </ConfirmModal>
      </div>
      {hasPurchase && (
        <Tooltip>
          <TooltipTrigger>
            <p className="text-muted-foreground text-xs hover:underline">
              Why this course cannot be deleted?
            </p>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>
              {purchaseCount} student(s) enrolled. Unpublish to prevent new
              students from enrolling.
            </p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};
