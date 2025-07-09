import CreateUserForm from "./_components/create-user-form";

export default function CreateUserPage() {
  return (
    <div className="p-6 flex flex-col space-y-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create User</h1>
      </div>
      <CreateUserForm />
    </div>
  );
}
