"use client";

import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session } = useSession();
  return (
    <div>
      <h1>Dashboard </h1>
      <p>Welcome {session?.user?.name}</p>
      {/* <code>
        <pre>{JSON.stringify(session, null, 2)}</pre>
      </code> */}
    </div>
  );
}
