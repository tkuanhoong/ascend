import { DataTable } from "@/components/data-table/custom-data-table";
import { columns } from "./_components/columns";

type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

async function getData(): Promise<Payment[]> {
  // Fetch data from API here.
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "a@example.com",
    },
    {
      id: "728ed51f",
      amount: 100,
      status: "pending",
      email: "b@example.com",
    },
    {
      id: "728ed54f",
      amount: 100,
      status: "pending",
      email: "c@example.com",
    },
    {
      id: "728ed54f",
      amount: 100,
      status: "pending",
      email: "d@example.com",
    },
    {
      id: "728ed54f",
      amount: 100,
      status: "pending",
      email: "e@example.com",
    },
    {
      id: "728ed54f",
      amount: 100,
      status: "pending",
      email: "f@example.com",
    },
    {
      id: "728ed54f",
      amount: 100,
      status: "pending",
      email: "g@example.com",
    },
    {
      id: "728ed54f",
      amount: 100,
      status: "pending",
      email: "h@example.com",
    },
    {
      id: "728ed54f",
      amount: 100,
      status: "pending",
      email: "i@example.com",
    },
    {
      id: "728ed54f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "728ed54f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "728ed54f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "728ed54f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    // ...
  ];
}

export default async function CoursesPage() {
  const data = await getData();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="container mx-auto py-2">
        <div>
          <h1 className="text-2xl font-semibold">Manage Courses</h1>
        </div>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
