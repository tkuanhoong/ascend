import { DataTable } from "@/components/data-table/custom-data-table";
import { db } from "@/lib/db";
import { columns } from "./_components/columns";

export default async function ManageUsersPage() {
  const users = await db.user.findMany();
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
