"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Backup } from "@/generated/prisma";
import { saveJsonFile } from "@/lib/file-save";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";
import { formatDateTime } from "@/lib/format";

export const columns: ColumnDef<Backup>[] = [
  {
    accessorKey: "fileName",
    header: "File name",
    cell: ({ row }) => {
      const fileName = row.getValue("fileName");

      return fileName;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created at",
    cell: ({ row }) => {
      const { createdAt } = row.original;
      return formatDateTime(createdAt);
    },
  },
  {
    id: "actions",
    header: "Download",
    cell: ({ row }) => {
      const { fileName, fileUrl } = row.original;

      return (
        <Button onClick={() => saveJsonFile({ url: fileUrl, fileName })}>
          <DownloadIcon />
        </Button>
      );
    },
  },
];
