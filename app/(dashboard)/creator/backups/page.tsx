import { DataTable } from "@/components/data-table/custom-data-table";
import { currentUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { columns } from "./_components/columns";
// import { saveAs } from "file-saver";

export const CourseBackupPage = async () => {
  const userId = await currentUserId();
  if (!userId) {
    redirect("/");
  }

  const data = await db.backup.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Course Backup</h1>
        <p className="text-sm text-muted-foreground">
          Create a backup of your course content structure including sections
          and chapters. The backup will be downloaded as a JSON file.
        </p>
      </div>

      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default CourseBackupPage;
