import React from 'react'

const StudentDashboard = () => {
  return (
    <div className="p-8 bg-gray-100  space-y-6 w-full rounded-lg">
      

      {/* Place Request Button */}
      <div className="flex w-full justify-end">

      <button className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700">
        Place New No Due Request
      </button>
      </div>

      {/* Request Cards */}
      <div className="space-y-6 mt-6">
        {/* Example Request Card */}
        <div className="bg-white shadow rounded p-6 w-full">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-semibold">Request ID: 1</h2>
              <p className="text-gray-500">Date: 2025-09-28</p>
            </div>
            <span className="text-yellow-600 font-semibold flex items-center">
              ⏳ Pending
            </span>
          </div>

          {/* Approvals Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left">Role</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Comments</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-4 py-2">Faculty Advisor</td>
                  <td className="px-4 py-2 text-green-600 font-semibold flex items-center gap-1">
                    ✅ Approved
                  </td>
                  <td className="px-4 py-2">All coursework verified</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2">Library</td>
                  <td className="px-4 py-2 text-yellow-600 font-semibold flex items-center gap-1">
                    ⏳ Pending
                  </td>
                  {/* <td className="px-4 py-2">Books to be returned</td> */}
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2">Accounts</td>
                  <td className="px-4 py-2 text-red-600 font-semibold flex items-center gap-1">
                    ❌ Rejected
                  </td>
                  <td className="px-4 py-2">Pending dues</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2">Hostel</td>
                  <td className="px-4 py-2 text-yellow-600 font-semibold flex items-center gap-1">
                    ⏳ Pending
                  </td>
                  {/* <td className="px-4 py-2">Clearance pending</td> */}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Add more cards similarly */}
      </div>
    </div>
  );
}

export default StudentDashboard
