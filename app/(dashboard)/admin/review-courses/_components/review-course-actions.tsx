import { ModalForm } from "@/components/form/modal-form";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Course, CourseStatus } from ".prisma/client";
import apiClient from "@/lib/axios";
import { successToast, unexpectedErrorToast } from "@/lib/toast";
import { MoreVerticalIcon, Eye, Check, X, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextAreaInput } from "@/components/form/text-area-input";
import { ConfirmModal } from "@/components/form/confirm-modal";
import { useState } from "react";

interface ReviewCourseActionsProps {
  course: Course;
}
const ReasonRequiredSchema = z.object({
  reason: z.string().min(1, { message: "Reason required" }),
});

const ReviewCourseActions = ({ course }: ReviewCourseActionsProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const coursePreviewLink = `/courses/${course.id}`;
  const isPendingCourse = course.status === CourseStatus.PENDING;
  const isPublishedCourse = course.status === CourseStatus.PUBLISHED;
  const isUnpublishedCourse = course.status === CourseStatus.UNPUBLISHED;
  const isRevokedCourse = course.status === CourseStatus.REVOKED;
  const isRejectedCourse = course.status === CourseStatus.REJECTED;
  const isDraftCourse = course.status === CourseStatus.DRAFT;
  const form = useForm({
    resolver: zodResolver(ReasonRequiredSchema),
    defaultValues: {
      reason: "",
    },
  });
  const handleReject = async (values: z.infer<typeof ReasonRequiredSchema>) => {
    try {
      await apiClient.patch(`/api/admin/courses/${course.id}/status`, {
        status: CourseStatus.REJECTED,
        ...values,
      });
      router.refresh();
      successToast({ message: "Course Updated" });
    } catch (error) {
      console.log(error);
      unexpectedErrorToast();
    }
    setIsModalOpen(false);
  };
  const handleApprove = async () => {
    try {
      await apiClient.patch(`/api/admin/courses/${course.id}/status`, {
        status: CourseStatus.PUBLISHED,
        reason: null,
      });
      router.refresh();
      successToast({ message: "Course Updated" });
    } catch (error) {
      console.log(error);
      unexpectedErrorToast();
    }
  };

  const handleRevoke = async (values: z.infer<typeof ReasonRequiredSchema>) => {
    try {
      await apiClient.patch(`/api/admin/courses/${course.id}/status`, {
        status: CourseStatus.REVOKED,
        ...values,
      });
      router.refresh();
      successToast({ message: "Course Updated" });
    } catch (error) {
      console.log(error);
      unexpectedErrorToast();
    }
  };

  const handleDelete = async () => {
    try {
      await apiClient.delete(`/api/admin/courses/${course.id}`);
      successToast({ message: "Course deleted" });
      router.refresh();
      form.reset();
    } catch (error) {
      unexpectedErrorToast();
      console.log(error);
    }
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
          size="icon"
        >
          <MoreVerticalIcon />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {isDraftCourse && (
          <ConfirmModal
            onConfirm={handleDelete}
            title="Confirm to delete this course?"
            desc="This action cannot be undone."
          >
            <DropdownMenuItem
              className="text-red-600"
              onSelect={(e) => e.preventDefault()}
            >
              <Trash2 />
              Delete
            </DropdownMenuItem>
          </ConfirmModal>
        )}
        {isPendingCourse && (
          <>
            <DropdownMenuItem asChild>
              <Link href={coursePreviewLink} target="_blank">
                <Eye />
                View Course
              </Link>
            </DropdownMenuItem>
            <ConfirmModal
              title="Confirm Approval"
              desc="This will publish the course to public."
              onConfirm={handleApprove}
            >
              <DropdownMenuItem
                className="text-emerald-600"
                onSelect={(e) => e.preventDefault()}
              >
                <Check />
                Approve
              </DropdownMenuItem>
            </ConfirmModal>

            <ModalForm
              open={isModalOpen}
              onOpenChange={setIsModalOpen}
              title="Reject Course to Publish"
              description="Provide a reason"
              trigger={
                <DropdownMenuItem
                  className="text-red-600"
                  onSelect={(e) => e.preventDefault()}
                >
                  <X />
                  Reject
                </DropdownMenuItem>
              }
            >
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleReject)}>
                  <TextAreaInput
                    control={form.control}
                    name="reason"
                    label="Reason"
                  />
                  <div className="flex items-center justify-end mt-2">
                    <Button type="submit">Save changes</Button>
                  </div>
                </form>
              </Form>
            </ModalForm>
          </>
        )}
        {(isPublishedCourse || isUnpublishedCourse) && (
          <>
            <DropdownMenuItem asChild>
              <Link href={coursePreviewLink} target="_blank">
                <Eye />
                View Course
              </Link>
            </DropdownMenuItem>
            <ModalForm
              open={isModalOpen}
              onOpenChange={setIsModalOpen}
              title="Revoke Course Publish Status"
              description="Provide a reason"
              trigger={
                <DropdownMenuItem
                  className="text-red-600"
                  onSelect={(e) => e.preventDefault()}
                >
                  Revoke
                </DropdownMenuItem>
              }
            >
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleRevoke)}>
                  <TextAreaInput
                    control={form.control}
                    name="reason"
                    label="Reason"
                  />
                  <div className="flex items-center justify-end mt-2">
                    <Button type="submit">Confirm</Button>
                  </div>
                </form>
              </Form>
            </ModalForm>
          </>
        )}
        {(isRevokedCourse || isRejectedCourse) && (
          <>
            <DropdownMenuItem asChild>
              <Link href={coursePreviewLink} target="_blank">
                <Eye />
                View Course
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-emerald-600"
              onClick={handleApprove}
            >
              <Check />
              Publish course
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ReviewCourseActions;
