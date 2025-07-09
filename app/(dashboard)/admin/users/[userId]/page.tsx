import { redirect } from "next/navigation";
import EditUserForm from "./_components/edit-user-form";
import EditUserPasswordForm from "./_components/edit-user-password-form";
import { getUserById } from "@/data/user";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  const user = await getUserById(userId);

  if (!user) {
    redirect("/admin/users");
  }

  return (
    <div className="p-6 flex flex-col space-y-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit User Profile</h1>
      </div>
      <EditUserForm initialData={user} />
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit User Password</h1>
      </div>
      <EditUserPasswordForm initialData={user} />
    </div>
  );
}
