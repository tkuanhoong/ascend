import { useRouter } from "next/navigation";
import { Row } from "@tanstack/react-table";
import apiClient from "@/lib/axios";
import { successToast, unexpectedErrorToast } from "@/lib/toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { User } from "@/generated/prisma";
import { ConfirmModal } from "@/components/form/confirm-modal";

interface UserTableDropdownActionsProps {
  row: Row<User>;
}

export const UserTableDropdownActions = ({
  row,
}: UserTableDropdownActionsProps) => {
  const router = useRouter();
  const { id } = row.original;
  const editUserUrl = `/admin/users/${id}`;

  const onDelete = async () => {
    try {
      await apiClient.delete(`/api/admin/users/${id}`);
      successToast({ message: "User deleted" });
      router.refresh();
    } catch (error) {
      unexpectedErrorToast();
      console.log(error);
    }
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <Link href={editUserUrl}>
          <DropdownMenuItem>
            <Pencil className="h-4 w-4 mr-2" /> Edit
          </DropdownMenuItem>
        </Link>
        <ConfirmModal
          title="Confirm to delete this user?"
          desc="This action cannot be undone."
          onConfirm={onDelete}
        >
          <DropdownMenuItem
            className="text-red-600"
            onSelect={(e) => e.preventDefault()}
          >
            <Trash2 className="h-4 w-4 mr-2" /> Delete
          </DropdownMenuItem>
        </ConfirmModal>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
