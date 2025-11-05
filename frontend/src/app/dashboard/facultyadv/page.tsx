"use client";
import React from 'react'
import { useState } from "react";

const FacultyAdvisorDashboard = () => {
  const [activeTab, setActiveTab] = useState("requests");
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 space-y-6">
        <h1 className="text-2xl font-bold text-blue-700 mb-8">
          Faculty Dashboard
        </h1>
        <nav className="space-y-4">
          <button
            onClick={() => setActiveTab("students")}
            className={`block w-full text-left px-3 py-2 rounded ${
              activeTab === "students"
                ? "bg-blue-600 text-white"
                : "hover:bg-blue-100 text-gray-700"
            }`}
          >
            👩‍🎓 Students
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`block w-full text-left px-3 py-2 rounded ${
              activeTab === "requests"
                ? "bg-blue-600 text-white"
                : "hover:bg-blue-100 text-gray-700"
            }`}
          >
            📄 Requests
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="flex justify-end items-center bg-white shadow px-6 py-4">
          <button className="text-red-600 font-semibold hover:text-red-700">
            🚪 Logout
          </button>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-8 space-y-6 overflow-y-auto">
          {activeTab === "students" && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-blue-700">Students</h2>
              <p className="text-gray-600">
                List of students will be displayed here.
              </p>
            </div>
          )}

          {activeTab === "requests" && (
            <div>
              <h1 className="text-3xl font-bold mb-6 text-blue-700">
                Requests
              </h1>

              {/* Example Request Cards */}
              <div className="space-y-6">
                {/* Pending Request Card */}
                <div className="bg-white shadow rounded p-6 w-full">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-blue-600">John Doe</h2>
                      <p className="text-sm text-gray-500 mt-1">Request ID: 1</p>
                      <p className="text-gray-600 mt-1">
                        Department: Computer Science
                      </p>
                      <p className="text-gray-600">Roll No: CS2025001</p>
                      <p className="text-gray-600">Program: B.Tech - CSE</p>
                      <p className="text-gray-500 mt-1">Date: 2025-09-28</p>
                    </div>
                    <span className="text-yellow-600 font-semibold flex items-center gap-1 mt-2">
                      ⏳ Pending
                    </span>
                  </div>

                  {/* Approve / Reject / Edit UI */}
                  <div className="mt-4 space-y-2">
                    <label className="block font-semibold text-blue-600">
                      Decision:
                    </label>
                    <div className="flex items-center space-x-4">
                      <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                        ✅ Approve
                      </button>
                      <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                        ❌ Reject
                      </button>
                      <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                        ✏️ Edit
                      </button>
                    </div>
                    <label className="block font-semibold mt-2 text-blue-600">
                      Comments:
                    </label>
                    <textarea
                      className="w-full border rounded p-2"
                      placeholder="Enter comments..."
                      rows={2}
                    />
                  </div>
                </div>

                {/* Rejected Request Card */}
                <div className="bg-white shadow rounded p-6 w-full">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-blue-600">
                        Jane Smith
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">Request ID: 2</p>
                      <p className="text-gray-600 mt-1">
                        Department: Electronics
                      </p>
                      <p className="text-gray-600">Roll No: EC2025005</p>
                      <p className="text-gray-600">Program: M.Tech - VLSI</p>
                      <p className="text-gray-500 mt-1">Date: 2025-09-27</p>
                    </div>
                    <span className="text-red-600 font-semibold flex items-center gap-1 mt-2">
                      ❌ Rejected
                    </span>
                  </div>

                  <div className="mt-4 space-y-2">
                    <label className="block font-semibold text-blue-600">
                      Decision:
                    </label>
                    <div className="flex items-center space-x-4">
                      <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                        ✏️ Edit
                      </button>
                    </div>
                    <label className="block font-semibold mt-2 text-blue-600">
                      Comments:
                    </label>
                    <textarea
                      disabled
                      className="w-full rounded p-2"
                      placeholder="Reason for rejection: Pending dues"
                      rows={2}
                      defaultValue="Pending dues"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}



















    // <div className="min-h-screen bg-gray-100 p-8 space-y-6 w-full">
    //   <h1 className="text-3xl font-bold">Faculty Advisor Dashboard</h1>

    //   {/* Example Request Cards */}
    //   <div className="space-y-6">
    //     {/* Pending Request Card */}
    //     <div className="bg-white shadow rounded p-6 w-full">
    //       <div className="flex justify-between items-start mb-4">
    //         <div>
    //           <h2 className="text-2xl font-bold">John Doe</h2>
    //           <p className="text-sm text-gray-500 mt-1">Request ID: 1</p>
    //           <p className="text-gray-600 mt-1">Department: Computer Science</p>
    //           <p className="text-gray-600">Roll No: CS2025001</p>
    //           <p className="text-gray-600">Program: B.Tech - CSE</p>
    //           <p className="text-gray-500 mt-1">Date: 2025-09-28</p>
    //         </div>
    //         <span className="text-yellow-600 font-semibold flex items-center gap-1 mt-2">
    //           ⏳ Pending
    //         </span>
    //       </div>

    //       {/* Approve / Reject / Edit UI */}
    //       <div className="mt-4 space-y-2">
    //         <label className="block font-semibold">Decision:</label>
    //         <div className="flex items-center space-x-4">
    //           <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
    //             ✅ Approve
    //           </button>
    //           <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
    //             ❌ Reject
    //           </button>
    //           <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
    //             ✏️ Edit
    //           </button>
    //         </div>
    //         <label className="block font-semibold mt-2">Comments:</label>
    //         <textarea
    //           className="w-full border rounded p-2"
    //           placeholder="Enter comments..."
    //           rows={2}
    //         />
    //       </div>
    //     </div>

    //     {/* Rejected Request Card */}
    //     <div className="bg-white shadow rounded p-6 w-full">
    //       <div className="flex justify-between items-start mb-4">
    //         <div>
    //           <h2 className="text-2xl font-bold">Jane Smith</h2>
    //           <p className="text-sm text-gray-500 mt-1">Request ID: 2</p>
    //           <p className="text-gray-600 mt-1">Department: Electronics</p>
    //           <p className="text-gray-600">Roll No: EC2025005</p>
    //           <p className="text-gray-600">Program: M.Tech - VLSI</p>
    //           <p className="text-gray-500 mt-1">Date: 2025-09-27</p>
    //         </div>
    //         <span className="text-red-600 font-semibold flex items-center gap-1 mt-2">
    //           ❌ Rejected
    //         </span>
    //       </div>

    //       {/* Approve / Reject / Edit UI */}
    //       <div className="mt-4 space-y-2">
    //         <label className="block font-semibold">Decision:</label>
    //         <div className="flex items-center space-x-4">
              
    //           <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
    //             ✏️ Edit
    //           </button>
    //         </div>
    //         <label className="block font-semibold mt-2">Comments:</label>
    //         <textarea
    //         disabled
    //           className="w-full rounded p-2"
    //           placeholder="Reason for rejection: Pending dues"
    //           rows={2}
    //           defaultValue="Pending dues"
    //         />
    //       </div>
    //     </div>

    //     {/* Add more request cards similarly */}
    //   </div>
    // </div> 


export default FacultyAdvisorDashboard


