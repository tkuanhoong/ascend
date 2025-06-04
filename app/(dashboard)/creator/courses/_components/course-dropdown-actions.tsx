import { CourseWithCategory } from "../page";
import { Row } from "@tanstack/react-table";
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
  DatabaseBackup,
  Eye,
  MoreHorizontal,
  Pencil,
} from "lucide-react";
import Link from "next/link";
import { CourseStatus } from "@prisma/client";

interface CourseRowDropdownActionsProps {
  row: Row<CourseWithCategory>;
}

export const CourseRowDropdownActions = ({
  row,
}: CourseRowDropdownActionsProps) => {
  const course = row.original;
  const { id, status } = course;
  const editCourseUrl = `/creator/courses/${id}`;
  const previewCourseUrl =
    status !== CourseStatus.DRAFT ? `/courses/${id}` : null;
  const viewLearnerProgressUrl = `/creator/courses/${id}/learner-progress`;

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
        {previewCourseUrl && (
          <Link href={previewCourseUrl} target="_blank">
            <DropdownMenuItem>
              <Eye className="h-4 w-4 mr-2" /> View Course
            </DropdownMenuItem>
          </Link>
        )}
        <DropdownMenuSeparator />
        <Link href={viewLearnerProgressUrl}>
          <DropdownMenuItem>
            <ChartNoAxesCombined className="h-4 w-4 mr-2" />
            Learner progress
          </DropdownMenuItem>
        </Link>
        <Link href={`/creator/courses/${id}/backup-settings`}>
          <DropdownMenuItem>
            <DatabaseBackup className="h-4 w-4 mr-2" />
            Create Backup
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
