"use client";
import { DataTable } from "@/components/data-table/custom-data-table";
import { CourseStatus } from ".prisma/client";
import { TabListSettings } from "@/components/data-table/data-table-tab-list";
import { columns } from "./columns";
import { CourseWithUserEmail } from "../page";

interface ReviewCoursesDataTableProps {
  data: CourseWithUserEmail[];
}

const ReviewCoursesDataTable = ({ data }: ReviewCoursesDataTableProps) => {
  const courseStatuses = Object.values(CourseStatus).map((status) => ({
    label: status.charAt(0) + status.slice(1).toLowerCase(),
    value: status,
  }));
  const tabFilter: TabListSettings = {
    tabFilterColumnId: "status",
    options: courseStatuses,
  };
  return (
    <DataTable
      columns={columns}
      data={data}
      tabFilter={tabFilter}
      filterColumn="email"
    />
  );
};

export default ReviewCoursesDataTable;
