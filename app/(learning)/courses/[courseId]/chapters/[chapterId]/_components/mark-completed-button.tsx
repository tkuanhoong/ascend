"use client";
import { Button } from "@/components/ui/button";
import apiClient from "@/lib/axios";
import { successToast, unexpectedErrorToast } from "@/lib/toast";
import { useRouter, useParams } from "next/navigation";
import { useTransition } from "react";

interface MarkCompletedButtonProps {
  sectionId: string;
  isCompleted: boolean;
}
export const MarkCompletedButton = ({
  sectionId,
  isCompleted,
}: MarkCompletedButtonProps) => {
  const { courseId, chapterId } = useParams();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const text = isCompleted ? "Mark as Uncompleted" : "Mark as Completed";

  const onClick = () => {
    startTransition(async () => {
      try {
        await apiClient.put(
          `/api/courses/${courseId}/sections/${sectionId}/chapters/${chapterId}/progress`,
          {
            isCompleted: !isCompleted,
          }
        );
        successToast({ message: `Chapter ${text}` });
        router.refresh();
      } catch (error) {
        unexpectedErrorToast();
        console.log(error);
      }
    });
  };

  return (
    <Button
      onClick={onClick}
      className="ml-auto items-end"
      disabled={isPending}
    >
      {text}
    </Button>
  );
};
