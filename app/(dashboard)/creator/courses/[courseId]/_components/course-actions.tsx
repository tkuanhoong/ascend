"use client";

import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { successToast, unexpectedErrorToast } from "@/lib/toast";
import apiClient from "@/lib/axios";
import { ConfirmModal } from "@/components/form/confirm-modal";
import { CourseStatus } from "@/generated/prisma";

interface CourseActionsProps {
  disabled: boolean;
  courseId: string;
  courseStatus: CourseStatus;
}

export const CourseActions = ({
  disabled,
  courseId,
  courseStatus,
}: CourseActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);
      if (
        courseStatus === CourseStatus.DRAFT ||
        courseStatus === CourseStatus.REJECTED ||
        courseStatus === CourseStatus.REVOKED
      ) {
        await apiClient.patch(`/api/courses/${courseId}/publish`);
        successToast({ message: "Course submitted for review" });
      } else {
        await apiClient.patch(`/api/courses/${courseId}/unpublish`);
        successToast({ message: "Course unpublished" });
      }
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
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onClick}
        disabled={
          disabled || isLoading || courseStatus === CourseStatus.PENDING
        }
        variant="outline"
        size="sm"
      >
        {courseStatus === CourseStatus.PENDING
          ? "Pending Review"
          : courseStatus === CourseStatus.PUBLISHED
          ? "Unpublish"
          : "Publish"}
      </Button>
      <ConfirmModal
        onConfirm={onDelete}
        title="Confirm to delete this course?"
        desc="This action cannot be undone. This will permanently delete the
            course and remove your data from our servers."
      >
        <Button size="sm" disabled={isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};
