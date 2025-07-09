"use client";

import { ConfirmModal } from "@/components/form/confirm-modal";
import { Button } from "@/components/ui/button";
import { Clock, Eye, FileText, GripVertical, Pencil, X } from "lucide-react";
import { useRouter } from "next/navigation";
import useIsModalOpen from "@/hooks/use-is-modal-open";
import { errorToast, successToast, unexpectedErrorToast } from "@/lib/toast";
import apiClient from "@/lib/axios";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import useIsEditable from "@/hooks/use-is-editable";
import { AxiosError } from "axios";
import { SectionWithChapterCount } from "@/types/section";
import { formatMinutes } from "@/lib/format";

export const SectionItemContent = ({
  data,
}: {
  data: SectionWithChapterCount | undefined;
}) => {
  const router = useRouter();
  const { setIsModalOpen } = useIsModalOpen();
  const { isEditable } = useIsEditable();
  if (!data) {
    return null;
  }

  const onEdit = () => {
    router.push(`/creator/courses/${courseId}/sections/${id}`);
  };
  const { id, title, courseId, isPublished, estimatedTime, _count } = data;

  const onDelete = async () => {
    try {
      await apiClient.delete(`/api/courses/${courseId}/sections/${id}`);
      successToast({ message: "Section deleted" });
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
        <div className="max-w-full md:max-w-20 lg:max-w-full space-y-2 my-2">
          <div className="flex items-center space-x-2">
            <p className="text-medium overflow-ellipsis line-clamp-1 break-words">
              {title}
            </p>
          </div>
          <div className="flex text-xs items-center flex-wrap gap-1">
            {estimatedTime && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="size-4" />
                {formatMinutes(estimatedTime)}
              </div>
            )}
            {!!_count.chapters && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <FileText className="size-4" />
                {_count.chapters} chapter(s)
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex ml-auto">
        <Badge
          className={cn("bg-slate-500 my-2", isPublished && "bg-indigo-700")}
        >
          {isPublished ? "Published" : "Draft"}
        </Badge>
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
            title="Confirm to delete this section?"
            desc="This action cannot be undone. This will permanently delete the
            section and remove your data from our servers."
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
