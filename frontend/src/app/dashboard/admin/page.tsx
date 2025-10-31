import React from 'react'

const AdminDashboard = () => {
  return (
    <div className="min-h-screen  p-8 space-y-8 w-full">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* CSV Upload Section */}
      <div className="shadow p-6 w-full max-w-lg bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Upload CSV</h2>
        <p className="text-gray-600 mb-2">
          Upload student and faculty advisor data in CSV format.
        </p>
        <input
          type="file"
          accept=".csv"
          className="border rounded px-3 py-2 w-full mb-4"
        />
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Upload
        </button>
      </div>
      {/* <div className=""></div> */}
    <h2 className="text-2xl font-bold">All Requests</h2>
      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <input
          type="text"
          placeholder="Search by student name or roll no"
          className="border rounded px-3 py-2 w-full md:w-1/2"
        />
        <select className="border rounded px-3 py-2 w-full md:w-1/4">
          <option value="">Filter by Department</option>
          <option value="CSE">Computer Science</option>
          <option value="ECE">Electronics</option>
          <option value="ME">Mechanical</option>
          <option value="CE">Civil</option>
        </select>
      </div>

      {/* Requests Monitoring Section */}
      <div className="space-y-6">
        

        {/* Example Request Card */}
        <div className="bg-white shadow rounded p-6 w-full">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold">John Doe</h2>
              <p className="text-sm text-gray-500 mt-1">Request ID: 1</p>
              <p className="text-gray-600 mt-1">Department: Computer Science</p>
              <p className="text-gray-600">Roll No: CS2025001</p>
              <p className="text-gray-600">Program: B.Tech - CSE</p>
              <p className="text-gray-500 mt-1">Faculty Advisor: Dr. Smith</p>
            </div>
            <span className="text-yellow-600 font-semibold flex items-center gap-1 mt-2">
              ⏳ Pending
            </span>
          </div>

          {/* Approvals Table */}
          <div className="overflow-x-auto mt-4">
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

        {/* Another example request card */}
        <div className="bg-white shadow rounded p-6 w-full">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold">Jane Smith</h2>
              <p className="text-sm text-gray-500 mt-1">Request ID: 2</p>
              <p className="text-gray-600 mt-1">Department: Electronics</p>
              <p className="text-gray-600">Roll No: EC2025005</p>
              <p className="text-gray-600">Program: M.Tech - VLSI</p>
              <p className="text-gray-500 mt-1">Faculty Advisor: Dr. Johnson</p>
            </div>
            <span className="text-red-600 font-semibold flex items-center gap-1 mt-2">
              ❌ Rejected
            </span>
          </div>

          <div className="overflow-x-auto mt-4">
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
                  <td className="px-4 py-2 text-red-600 font-semibold flex items-center gap-1">
                    ❌ Rejected
                  </td>
                  <td className="px-4 py-2">Pending dues</td>
                </tr>
                {/* <tr className="border-t">
                  <td className="px-4 py-2">Library</td>
                  <td className="px-4 py-2 text-green-600 font-semibold flex items-center gap-1">
                    ✅ Approved
                  </td>
                  <td className="px-4 py-2">Books returned</td>
                </tr> */}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-2 mt-4">
        <button className="px-3 py-1 border rounded hover:bg-gray-200">« Prev</button>
        <button className="px-3 py-1 border rounded bg-blue-600 text-white">1</button>
        <button className="px-3 py-1 border rounded hover:bg-gray-200">2</button>
        <button className="px-3 py-1 border rounded hover:bg-gray-200">3</button>
        <button className="px-3 py-1 border rounded hover:bg-gray-200">Next »</button>
      </div>
    </div>
  );
}

export default AdminDashboard
