"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, ChevronLeft, ChevronRight, CheckCircle, Clock, XCircle, Users } from "lucide-react"
import { UploadSection } from "./upload-section"
import Navbar from "@/components/navbar"

const mockRequests = [
  {
    id: 1,
    name: "John Doe",
    rollNo: "CS2025001",
    department: "Computer Science",
    program: "B.Tech - CSE",
    advisor: "Dr. Smith",
    status: "pending",
    approvals: [
      { role: "Faculty Advisor", status: "approved", comment: "All coursework verified" },
      { role: "Library", status: "pending", comment: "" },
      { role: "Accounts", status: "rejected", comment: "Pending dues" },
      { role: "Hostel", status: "pending", comment: "" },
    ],
  },
  {
    id: 2,
    name: "Jane Smith",
    rollNo: "EC2025005",
    department: "Electronics",
    program: "M.Tech - VLSI",
    advisor: "Dr. Johnson",
    status: "rejected",
    approvals: [{ role: "Faculty Advisor", status: "rejected", comment: "Pending dues" }],
  },
  {
    id: 3,
    name: "Raj Kumar",
    rollNo: "ME2025012",
    department: "Mechanical",
    program: "B.Tech - ME",
    advisor: "Prof. Williams",
    status: "approved",
    approvals: [
      { role: "Faculty Advisor", status: "approved", comment: "All coursework verified" },
      { role: "Library", status: "approved", comment: "Books returned" },
      { role: "Accounts", status: "approved", comment: "No dues" },
      { role: "Hostel", status: "approved", comment: "Room cleared" },
    ],
  },
]

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDept, setSelectedDept] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  const filteredRequests = mockRequests.filter((req) => {
    const matchesSearch =
      req.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDept = selectedDept === "all" || req.department === selectedDept
    return matchesSearch && matchesDept
  })

  const itemsPerPage = 5
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage)
  const paginatedRequests = filteredRequests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Navbar/>
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          </div>
          <p className="text-foreground-muted">Manage and track student clearance requests across all departments</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Upload Section */}
        <UploadSection />

        {/* Requests Section */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">All Requests</h2>
            <p className="text-foreground-muted">
              {filteredRequests.length} total request{filteredRequests.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Search and Filter */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <div className="relative ">
                <Search className="absolute left-3 top-3 w-4 h-4 text-foreground-muted " />
                <Input
                  placeholder="Search by student name or roll number..."
                  className="pl-10 bg-background border border-border"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                />
              </div>
            </div>
            <Select
              value={selectedDept}
              onValueChange={(value) => {
                setSelectedDept(value)
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Computer Science">Computer Science</SelectItem>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Mechanical">Mechanical</SelectItem>
                <SelectItem value="Civil">Civil</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Request Cards */}
          <div className="space-y-4">
            {paginatedRequests.length > 0 ? (
              paginatedRequests.map((request) => (
                <Card key={request.id} className="border-border bg-card">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-xl">{request.name}</CardTitle>
                          <StatusBadge status={request.status} />
                        </div>
                        <CardDescription>Request ID: {request.id}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-foreground-muted font-medium">Department</p>
                        <p className="text-foreground">{request.department}</p>
                      </div>
                      <div>
                        <p className="text-foreground-muted font-medium">Roll No</p>
                        <p className="text-foreground">{request.rollNo}</p>
                      </div>
                      <div>
                        <p className="text-foreground-muted font-medium">Program</p>
                        <p className="text-foreground">{request.program}</p>
                      </div>
                      <div>
                        <p className="text-foreground-muted font-medium">Faculty Advisor</p>
                        <p className="text-foreground">{request.advisor}</p>
                      </div>
                    </div>

                    {/* Approvals Table */}
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-sm font-semibold text-foreground mb-3">Approval Status</p>
                      <div className="space-y-2">
                        {request.approvals.map((approval) => (
                          <div
                            key={approval.role}
                            className="flex items-center justify-between py-2 px-3 rounded-lg bg-background"
                          >
                            <div className="flex-1">
                              <p className="text-sm font-medium text-foreground">{approval.role}</p>
                              {approval.comment && <p className="text-xs text-foreground-muted">{approval.comment}</p>}
                            </div>
                            <ApprovalStatusIcon status={approval.status} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="border-border bg-card">
                <CardContent className="py-12 text-center">
                  <p className="text-foreground-muted">No requests found matching your filters</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="border-border"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <Button
                  key={i + 1}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(i + 1)}
                  className={currentPage === i + 1 ? "" : "border-border"}
                >
                  {i + 1}
                </Button>
              ))}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="border-border"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig = {
    approved: { label: "Approved", color: "bg-green-500/10 text-green-700 dark:text-green-400" },
    pending: { label: "Pending", color: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400" },
    rejected: { label: "Rejected", color: "bg-red-500/10 text-red-700 dark:text-red-400" },
  }

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
  return <Badge className={`${config.color} border-0`}>{config.label}</Badge>
}

function ApprovalStatusIcon({ status }: { status: string }) {
  if (status === "approved") {
    return <CheckCircle className="w-5 h-5 text-emerald-500" />
  } else if (status === "rejected") {
    return <XCircle className="w-5 h-5 text-destructive" />
  } else {
    return <Clock className="w-5 h-5 text-yellow-500" />
  }
}
