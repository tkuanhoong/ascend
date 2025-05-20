"use client";

import { ConfirmModal } from "@/components/form/confirm-modal";
import { Button } from "@/components/ui/button";
import { Section } from "@/generated/prisma";
import { GripVertical, Pencil, X } from "lucide-react";
import { useRouter } from "next/navigation";
import useIsModalOpen from "@/hooks/use-is-modal-open";
import { successToast, unexpectedErrorToast } from "@/lib/toast";
import apiClient from "@/lib/axios";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const SectionItemContent = ({ data }: { data: Section | undefined }) => {
  const router = useRouter();
  const { setIsModalOpen } = useIsModalOpen();
  if (!data) {
    return null;
  }

  const onEdit = () => {
    router.push(`/creator/courses/${courseId}/sections/${id}`);
  };
  const { id, title, courseId, isPublished } = data;

  const onDelete = async () => {
    try {
      await apiClient.delete(`/api/courses/${courseId}/sections/${id}`);
      successToast({ message: "Section deleted" });
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
        <div className="flex gap-x-1">
          <Badge
            className={cn("bg-slate-500 my-2", isPublished && "bg-indigo-700")}
          >
            {isPublished ? "Published" : "Draft"}
          </Badge>
        </div>

        <Button variant="ghost" className="lg:p-4 p-2" onClick={onEdit}>
          <Pencil className="size-4" />
        </Button>
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
      </div>
    </>
  );
};
