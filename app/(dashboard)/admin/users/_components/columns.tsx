"use client";

import { User } from ".prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { UserTableDropdownActions } from "./user-table-dropdown-actions";
import { CheckCircle, XCircle } from "lucide-react";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "email",
    header: "Email address",
  },
  {
    accessorKey: "name",
    header: "Full name",
  },
  {
    accessorKey: "identificationNo",
    header: "IC no.",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "emailVerified",
    header: () => <div className="flex justify-end">Email verification</div>,
    cell: ({ row }) => {
      const { emailVerified } = row.original;
      return (
        <div className="flex items-center justify-end gap-2">
          {emailVerified ? (
            <>
              Verified
              <CheckCircle className="size-4" />
            </>
          ) : (
            <>
              Not Verified
              <XCircle className="size-4" />
            </>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <UserTableDropdownActions row={row} />;
    },
  },
];
