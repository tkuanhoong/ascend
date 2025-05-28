"use client";

import { Badge } from "@/components/ui/badge";
import { CourseStatus } from ".prisma/client";
import { formattedToMYR } from "@/lib/currency";
import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle2Icon, LoaderIcon } from "lucide-react";
import ReviewCourseActions from "./review-course-actions";
import { Button } from "@/components/ui/button";
import { ModalForm } from "@/components/form/modal-form";
import { CourseWithUserEmail } from "../page";

export const columns: ColumnDef<CourseWithUserEmail>[] = [
  {
    accessorKey: "email",
    accessorFn: (row) => row.user.email,
    header: "Creator's email"
  },
  {
    accessorKey: "title",
    header: "Course title",
  },
  {
    accessorKey: "price",
    header: "Course price",
    cell: ({ row }) => formattedToMYR(row.original.price ?? 0),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3"
      >
        {row.original.status === CourseStatus.PUBLISHED ? (
          <CheckCircle2Icon className="text-green-500 dark:text-green-400" />
        ) : (
          <LoaderIcon />
        )}
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "reason",
    header: "Reason",
    cell: ({ row }) => {
      const reason = row.getValue("reason");
      if (reason) {
        return (
          <ModalForm
            trigger={<Button variant="link">View</Button>}
            title="Reason"
          >
            <div>{reason as string}</div>
          </ModalForm>
        );
      }
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const course = row.original;

      return <ReviewCourseActions course={course} />;
    },
  },
];
