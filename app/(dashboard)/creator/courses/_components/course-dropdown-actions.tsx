import { useRouter } from "next/navigation";
import { CourseWithCategory } from "../page";
import { Row } from "@tanstack/react-table";
import apiClient from "@/lib/axios";
import { successToast, unexpectedErrorToast } from "@/lib/toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  ChartNoAxesCombined,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import Link from "next/link";

interface CourseRowDropdownActionsProps {
  row: Row<CourseWithCategory>;
}

export const CourseRowDropdownActions = ({
  row,
}: CourseRowDropdownActionsProps) => {
  const router = useRouter();
  const course = row.original;
  const { id } = course;
  const editCourseUrl = `/creator/courses/${id}`;
  const viewLearnerProgressUrl = `/creator/courses/${id}/learner-progress`;

  const onDelete = async () => {
    try {
      await apiClient.delete(`/api/courses/${id}`);
      router.refresh();
      successToast({ message: "Course deleted" });
    } catch (error) {
      unexpectedErrorToast();
      console.log(error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <Link href={editCourseUrl}>
          <DropdownMenuItem>
            <Pencil className="h-4 w-4 mr-2" /> Edit
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem className="text-red-600" onClick={onDelete}>
          <Trash2 className="h-4 w-4 mr-2" /> Delete
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <Link href={viewLearnerProgressUrl}>
          <DropdownMenuItem>
            <ChartNoAxesCombined className="h-4 w-4 mr-2" />
            Learner progress
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
