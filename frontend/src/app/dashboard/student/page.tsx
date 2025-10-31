import Navbar from "@/components/navbar";
import { getCurrentUser, getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";
import CurrentRequest from "./current-req";

const StudentDashboard = async () => {
  const user = await getCurrentUser();
  if (user.role !== "student") redirect("/unauthorized");

  return (
    <>
      <Navbar />
      <div className="p-4 md:p-16 bg-background  space-y-6 w-full rounded-lg">
        {/* Place Request Button */}
        <div className="flex w-full justify-end">
          <button className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700">
            Place New No Due Request
          </button>
        </div>

        <div className="rounded-lg bg-background-muted p-4 flex flex-col justify-center items-center w-full">
          Current Request details
          <CurrentRequest />
        </div>

        <>
          <h1 className="text-xl">Previous requests</h1>
          {/* Request Cards */}
          <div className="space-y-6 mt-6">
            {/* Example Request Card */}
            <div className="bg-background-muted rounded-lg p-6 w-full">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-semibold">Request ID: 1</h2>
                  <p className="text-foreground-muted">Date: 2025-09-28</p>
                </div>
                <span className="text-yellow-600 font-semibold flex items-center">
                  ⏳ Pending
                </span>
              </div>

              {/* Approvals Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full border rounded">
                  <thead className="bg-background-muted">
                    <tr>
                      <th className="px-4 py-2 text-left">Role</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">Comments</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t bg-background">
                      <td className="px-4 py-2">Faculty Advisor</td>
                      <td className="px-4 py-2 text-green-600 font-semibold flex items-center gap-1">
                        ✅ Approved
                      </td>
                      <td className="px-4 py-2">All coursework verified</td>
                    </tr>
                    <tr className="border-t bg-background">
                      <td className="px-4 py-2">Library</td>
                      <td className="px-4 py-2 text-yellow-600 font-semibold flex items-center gap-1">
                        ⏳ Pending
                      </td>
                      <td className="px-4 py-2"></td>
                    </tr>
                    <tr className="border-t bg-background">
                      <td className="px-4 py-2">Accounts</td>
                      <td className="px-4 py-2 text-red-600 font-semibold flex items-center gap-1">
                        ❌ Rejected
                      </td>
                      <td className="px-4 py-2">Pending dues</td>
                    </tr>
                    <tr className="border-t bg-background">
                      <td className="px-4 py-2">Hostel</td>
                      <td className="px-4 py-2 text-yellow-600 font-semibold flex items-center gap-1">
                        ⏳ Pending
                      </td>
                      <td className="px-4 py-2"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Add more cards similarly */}
          </div>
        </>
      </div>
    </>
  );
};

export default StudentDashboard;
