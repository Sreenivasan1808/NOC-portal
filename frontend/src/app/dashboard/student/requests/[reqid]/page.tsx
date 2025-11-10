"use client";

import {
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useRequestDetails } from "./hooks";
import { INoDueReq, IDepartmentApproval, IFacultyAdvisorApproval } from "@/types/types"; // ✅ Ensure correct import
import { use } from "react";

// ✅ Helpers
function getStatusIcon(status: IFacultyAdvisorApproval["status"] | IDepartmentApproval["status"] | string) {
  switch (status) {
    case "Approved":
      return <CheckCircle className="w-5 h-5" />;
    case "Rejected":
      return <XCircle className="w-5 h-5" />;
    case "Pending":
      return <Clock className="w-5 h-5" />;
    default:
      return <AlertCircle className="w-5 h-5" />;
  }
}

function getStatusColor(status: IFacultyAdvisorApproval["status"] | IDepartmentApproval["status"] | string) {
  switch (status) {
    case "Approved":
      return "bg-primary text-primary-foreground";
    case "Rejected":
      return "bg-red-600 text--foreground";
    case "Pending":
      return "bg-amber-600 text-background";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function getProgressColor(status: IFacultyAdvisorApproval["status"] | IDepartmentApproval["status"] | string) {
  switch (status) {
    case "Approved":
      return "text-primary";
    case "Rejected":
      return "text-destructive";
    case "Pending":
      return "text-secondary";
    default:
      return "text-muted-foreground";
  }
}

// ✅ Handles both native Date and MongoDB { $date: string }
function formatDate(dateObj?: Date | string) {
  if (!dateObj) return "Not yet processed";

  const date = dateObj instanceof Date ? dateObj : new Date(dateObj);

  if (isNaN(date.getTime())) return "Invalid date";

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function RequestDetails({
  params,
}: {
  params: Promise<{ reqid: string }>;
}) {
  const { reqid } = use(params);
  const { data, isLoading } = useRequestDetails(reqid);

  if (!data && isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div className="text-center py-10 text-foreground-muted">Request not found.</div>;
  }

  const approvedCount = data.departmentApprovals?.filter((d) => d.status === "Approved").length;
  const rejectedCount = data.departmentApprovals?.filter((d) => d.status === "Rejected").length;
  const pendingCount = data.departmentApprovals?.filter((d) => d.status === "Pending").length;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Approval Workflow</h1>
        <p className="text-foreground-muted">
          Student Roll No: <span className="font-semibold">{data.studentRollNumber}</span>
        </p>
      </div>

      {/* Overall Status Card */}
      <div className={`rounded-lg p-6 ${getStatusColor(data?.status)}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon(data?.status)}
            <div>
              <p className="text-sm opacity-90">Overall Status</p>
              <p className="text-2xl font-bold">{data?.status}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-75">Updated</p>
            <p className="text-sm font-medium">{formatDate(data?.updatedAt)}</p>
          </div>
        </div>
      </div>

      {/* Progress Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-background-muted rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-primary">{approvedCount}</p>
          <p className="text-sm text-foreground-muted mt-1">Approved</p>
        </div>
        <div className="bg-background-muted rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-red-500">{rejectedCount}</p>
          <p className="text-sm text-foreground-muted mt-1">Rejected</p>
        </div>
        <div className="bg-background-muted rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-amber-500">{pendingCount}</p>
          <p className="text-sm text-foreground-muted mt-1">Pending</p>
        </div>
      </div>

      {/* Faculty Advisor */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Faculty Advisor</h2>
        <div className="bg-background-muted rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${getStatusColor(data.facultyAdvisorApproval.status)}`}>
              {getStatusIcon(data.facultyAdvisorApproval.status)}
            </div>
            <div>
              <p className="font-medium text-foreground">{data.facultyAdvisorApproval.status}</p>
              <p className="text-sm text-foreground-muted">
                {formatDate(data.facultyAdvisorApproval.date)}
              </p>
            </div>
          </div>
          <div
            className={`h-1 flex-1 mx-4 rounded-full ${getProgressColor(
              data.facultyAdvisorApproval.status
            )} bg-current opacity-20`}
          />
        </div>
      </div>

      {/* Departments */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Department Approvals</h2>
        <div className="space-y-2">
          {data.departmentApprovals.map((approval, index) => (
            <div
              key={approval.approverId + index}
              className="bg-background-muted rounded-lg p-4 flex items-center justify-between hover:bg-background-muted/80 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className={`p-2 rounded-full flex-shrink-0 ${getStatusColor(approval.status)}`}>
                  {getStatusIcon(approval.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{approval.department}</p>
                  <p className="text-sm text-foreground-muted">{formatDate(approval.date)}</p>
                  <p className="text-sm text-foreground">{approval.rejectionReason}</p>
                </div>
              </div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  approval.status
                )}`}
              >
                {approval.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-background-muted rounded-lg p-4 text-sm text-foreground-muted">
        <p>
          <span className="font-medium">Created:</span> {formatDate(data.createdAt)}
        </p>
        <p className="mt-2">
          <span className="font-medium">Last Updated:</span> {formatDate(data.updatedAt)}
        </p>
      </div>
    </div>
  );
}
