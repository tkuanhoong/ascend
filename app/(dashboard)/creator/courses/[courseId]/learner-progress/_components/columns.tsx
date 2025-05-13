"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PurchasesWithUserWithProgress } from "@/data/course/get-learner-progress-list";
import { CourseProgress } from "@/components/course/course-progress,";

export const columns: ColumnDef<PurchasesWithUserWithProgress>[] = [
  {
    accessorKey: "name",
    accessorFn: (row) => row.user.name,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    accessorFn: (row) => row.user.email,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "progress",
    header: () => <div>Progress</div>,
    cell: ({ row }) => {
      const { progress } = row.original;

      return (
        <CourseProgress
          variant={progress === 100 ? "success" : "default"}
          value={progress}
        />
      );
    },
  },
];
