"use client";

import { formattedToMYR } from "@/lib/currency";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CourseWithCategory } from "../page";
import { CourseRowDropdownActions } from "./course-dropdown-actions";

export const columns: ColumnDef<CourseWithCategory>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Course title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Course category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const course = row.original;

      return course.category?.name ?? "-";
    },
  },
  {
    accessorKey: "price",
    header: () => <div className="text-right">Price</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price") || "0");
      const formatted = formattedToMYR(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="text-right">Status</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium">{row.getValue("status")}</div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <CourseRowDropdownActions row={row} />;
    },
  },
];
