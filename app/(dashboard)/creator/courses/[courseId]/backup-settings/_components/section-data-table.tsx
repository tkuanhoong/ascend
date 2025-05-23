"use client";

import { useEffect, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { SelectedSection } from "@/app/api/courses/[courseId]/backup/route";

interface Chapter {
  id: string;
  title: string;
}

interface Section {
  id: string;
  title: string;
  chapters: Chapter[];
}

interface SectionDataTableProps {
  courseId: string;
  initialSection: Section;
  handleSelectionChange: (updatedSection: SelectedSection) => void;
  handleSelectionDelete: (sectionId: string) => void;
  disabled?: boolean;
}

export function SectionDataTable({
  initialSection,
  handleSelectionChange,
  handleSelectionDelete,
  disabled,
}: SectionDataTableProps) {
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [selectedChapterIds, setSelectedChapterIds] = useState<string[]>([]);
  const [selectedSection, setSelectedSection] =
    useState<SelectedSection | null>(null);

  useEffect(() => {
    if (selectedSection) {
      handleSelectionChange(selectedSection);
    }
  }, [handleSelectionChange, selectedSection]);

  const sectionColumns: ColumnDef<Chapter>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            table.getIsSomePageRowsSelected() ||
            !!selectedSectionId
          }
          onCheckedChange={(value) => {
            if (!!value) {
              setSelectedSectionId(initialSection.id);
            } else {
              handleSelectionDelete(selectedSectionId);
              setSelectedSectionId("");
              table.toggleAllPageRowsSelected(!!value);
            }
          }}
          aria-label="Select section"
          disabled={disabled}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
            if (!selectedSectionId) {
              setSelectedSectionId(initialSection.id);
            }
          }}
          aria-label={`Select section ${row.original.title}`}
          disabled={disabled}
        />
      ),
    },
    {
      accessorKey: "title",
      header: initialSection.title,
    },
  ];

  const table = useReactTable({
    data: initialSection.chapters,
    columns: sectionColumns,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    table.toggleAllRowsSelected();
    setSelectedSectionId(initialSection.id);
  }, [table, initialSection.id]);

  const selectedRowIds = table.getSelectedRowModel().rowsById;

  useEffect(() => {
    setSelectedChapterIds([
      ...Object.values(selectedRowIds).map((item) => item.original.id),
    ]);
  }, [selectedRowIds]);

  useEffect(() => {
    if (!selectedSectionId) {
      setSelectedSection(null);
      return;
    }
    setSelectedSection({
      id: selectedSectionId,
      chapterIds: selectedChapterIds,
    });
  }, [selectedSectionId, selectedChapterIds]);

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={sectionColumns.length}
                  className="h-24 text-center"
                >
                  No chapters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
