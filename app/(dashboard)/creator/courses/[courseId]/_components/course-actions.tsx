"use client";

import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { successToast, unexpectedErrorToast } from "@/lib/toast";
import apiClient from "@/lib/axios";
import { ConfirmModal } from "@/components/form/confirm-modal";

interface CourseActionsProps {
  disabled: boolean;
  courseId: string;
  isPublished: boolean;
}

export const CourseActions = ({
  disabled,
  courseId,
  isPublished,
}: CourseActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);
      if (isPublished) {
        await apiClient.patch(`/api/courses/${courseId}/unpublish`);
        successToast({ message: "Course unpublished" });
      } else {
        await apiClient.patch(`/api/courses/${courseId}/publish`);
        successToast({ message: "Course published" });
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
        disabled={disabled || isLoading}
        variant="outline"
        size="sm"
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};
