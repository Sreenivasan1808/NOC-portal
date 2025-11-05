import Navbar from "@/components/navbar";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";
import NewRequest from "./new-req";
import CurrentRequest from "./current-req";
import PreviousRequests from "./prev-req";
import axios from "axios";
import { getSession } from "@/lib/auth";

const StudentDashboard = async () => {
  const user = await getCurrentUser();
  if (user.role !== "student") redirect("/unauthorized");

  // Server-side prefetch the student's requests so the client can hydrate immediately.
  let initialRequests = null;
  try {
    const session = await getSession();
    const base = process.env.SERVER_URL as string;
    const resp = await axios.get(
      `${base}/api/requests/student/${user.rollNumber}`,
      {
        headers: { Authorization: `Bearer ${session}` },
      }
    );
    initialRequests = resp.data;
  } catch {
    // ignore - initialRequests stays null
  }

  return (
    <>
      <Navbar />
      <div className="p-4 md:p-16 bg-background  space-y-6 w-full rounded-lg">
        {/* Place Request Button */}
        <NewRequest />

          <h2 className="text-xl">Your active request</h2>
        <div className="rounded-lg bg-background-muted p-4 flex flex-col justify-center items-center w-full">
          <CurrentRequest currentReq={initialRequests} rollNumber={user.rollNumber}/>
        </div>

        <div>
          {/* Hydrated client component with refetch/loading support */}
          <PreviousRequests
            rollNumber={user.rollNumber}
            initialData={initialRequests}
          />
        </div>
      </div>
    </>
  );
};

export default StudentDashboard;
