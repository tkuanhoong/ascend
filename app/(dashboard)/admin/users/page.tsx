import { DataTable } from "@/components/data-table/custom-data-table";
import { columns } from "./_components/columns";
import { getAllUser } from "@/data/user";

export default async function ManageUsersPage() {
  const users = await getAllUser();
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Manage users</h1>
      </div>
      <DataTable
        data={users}
        columns={columns}
        filterColumn="email"
        createButtonHref="/admin/users/create"
      />
    </div>
  );
}
