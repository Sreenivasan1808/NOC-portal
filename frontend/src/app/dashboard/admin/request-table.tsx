"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock } from "lucide-react"

interface RequestItem {
  _id: string
  studentRollNumber: string
  status: string
  createdAt?: string
  updatedAt?: string
  departmentApprovals?: Array<{ department: string; status: string }>
}

interface RequestTableProps {
  items: RequestItem[]
}

function getDepartmentBadge(status: string) {
  switch (status.toLowerCase()) {
    case "approved":
      return (
        <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1 w-fit">
          <CheckCircle className="w-3 h-3" />
          Approved
        </Badge>
      )
    case "rejected":
      return (
        <Badge className="bg-red-100 text-red-800 flex items-center gap-1 w-fit">
          <XCircle className="w-3 h-3" />
          Rejected
        </Badge>
      )
    case "pending":
      return (
        <Badge className="bg-amber-100 text-amber-800 flex items-center gap-1 w-fit">
          <Clock className="w-3 h-3" />
          Pending
        </Badge>
      )
    default:
      return <Badge className="w-fit">{status}</Badge>
  }
}

export function RequestTable({ items }: RequestTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow >
          <TableHead>Roll No</TableHead>
          <TableHead>Student Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Updated</TableHead>
          <TableHead>Departments</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-6">
              No requests found
            </TableCell>
          </TableRow>
        ) : (
          items.map((it) => (
            <TableRow key={it._id} className="bg-background">
              <TableCell className="bg-background">{it.studentRollNumber}</TableCell>
              <TableCell className="bg-background">{it.status}</TableCell>
              <TableCell className="bg-background">{it.createdAt ? new Date(it.createdAt).toLocaleString() : "-"}</TableCell>
              <TableCell className="bg-background">{it.updatedAt ? new Date(it.updatedAt).toLocaleString() : "-"}</TableCell>
              <TableCell className="bg-background">
                {Array.isArray(it.departmentApprovals) && it.departmentApprovals.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {it.departmentApprovals.map((approval, idx) => (
                      <div key={idx} className="flex flex-col gap-1">
                        <span className="text-xs text-gray-600">{approval.department}</span>
                        {getDepartmentBadge(approval.status)}
                      </div>
                    ))}
                  </div>
                ) : (
                  "-"
                )}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
