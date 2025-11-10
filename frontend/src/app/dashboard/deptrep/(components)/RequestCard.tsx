"use client";
import React, { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Clock, Edit2 } from "lucide-react";
import ApproveDialog from "@/components/ApproveDialog";
import RejectDialog from "@/components/RejectDialog";
import { getCurrentUser, getSession } from "@/lib/auth";
import { IDeptRep, IFacultyAdvisor, INoDueReq, IStudent } from "@/types/types";
import { useDeptRepRequests } from "../(hooks)/useDeptRepRequests";
import { toast } from "sonner";
import axios from "axios";

export default function RequestCard({
  request,
}: {
  request: INoDueReq & {
    studentData: IStudent;
    _id: string;
  };
}) {
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [currentUser, setCurrentUser] = useState<
    IStudent | IFacultyAdvisor | IDeptRep | null
  >(null);
  const { refresh } = useDeptRepRequests();

  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  // load current user (to read user.department)
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const user = await getCurrentUser(); // expected to return { department, ... }
        if (mounted) setCurrentUser(user);
        console.log("user", user);
      } catch (err) {
        console.error("getCurrentUser failed", err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleReopenClick = async () => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/requests/reopen/${request._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${await getSession()}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Request reopened successfully");
        refresh();
      }
    } catch (error) {
      toast.error("Failed to reopen request");
      console.log(error);
    }
  };

  // helpers
  const formatDate = (d: Date) => {
    if (!d) return "—";
    try {
      return new Date(d).toLocaleString();
    } catch {
      return String(d);
    }
  };

  const getStatusIcon = (status: string | undefined) => {
    const s = (status ?? "").toString().toLowerCase();
    switch (s) {
      case "pending":
        return <Clock className="w-5 h-5 text-amber-500" />;
      case "fa approved":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  // const getStatusLabel = (status: string | undefined) => {
  //   if (!status) return "";
  //   const s = status.toString();
  //   return s.charAt(0).toUpperCase() + s.slice(1);
  // };

  // whether we should show action buttons (require overall status exactly 'FA Approved')
  const deptObj = request.departmentApprovals.find(
    (d) => d.department === currentUser?.department
  );
  const showActions =
    String(request?.status ?? "").toLowerCase() === "fa approved" &&
    deptObj?.status === "Pending";

  const showEditButton =
    (String(request?.status ?? "").toLowerCase() === "fa approved" ||String(request?.status ?? "").toLowerCase() === "rejected") &&
    deptObj?.status !== "Pending";

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-muted">
              {getStatusIcon(request.status)}
              <span className="text-sm font-medium text-foreground">
                {/* {getStatusLabel(request.status)} */}
                {request.status}
              </span>
            </div>
          </div>

          <h2 className="py-4 text-2xl font-semibold leading-none tracking-tight text-foreground">
            {request.studentData?.name ?? "—"}
          </h2>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-xs text-foreground-muted uppercase tracking-wide">
                Request ID
              </p>
              <p className="text-foreground font-medium">
                #{request._id ?? "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-foreground-muted uppercase tracking-wide">
                Roll Number
              </p>
              <p className="text-foreground font-medium">
                {request.studentRollNumber ?? "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-foreground-muted uppercase tracking-wide">
                Department
              </p>
              <p className="text-foreground font-medium">
                {request.studentData?.department ?? "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-foreground-muted uppercase tracking-wide">
                Program
              </p>
              <p className="text-foreground font-medium">
                {request.studentData?.program ?? "—"}
              </p>
            </div>

            {deptObj?.status === "Rejected" && (
              <div>
                <p className="text-xs text-foreground-muted uppercase tracking-wide">
                  Rejection reason
                </p>
                <p className="text-foreground font-medium">
                  {deptObj?.rejectionReason ?? "-"}
                </p>
              </div>
            )}
          </div>

          <div className="mt-4">
            <p className="text-sm text-foreground-muted">
              Submitted on {formatDate(request.createdAt ?? new Date())}
            </p>
          </div>
        </div>
      </div>

      {/* Horizontal seperator */}
      <div className="mt-4 border-t border-border pt-4" />

      {/* Show rejection reason input if rejecting */}
      {showActions && (
        <div className="mt-4 space-y-3">
          <div className="flex gap-3">
            <button
              disabled={loadingApprove}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors hover:cursor-pointer"
              onClick={() => {
                setLoadingApprove(true);
                setShowApproveDialog(true);
              }}
            >
              <CheckCircle2 className="w-4 h-4" />
              {showApproveDialog ? "Approving..." : "Approve"}
            </button>

            <button
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors hover:cursor-pointer"
              onClick={() => {
                setShowRejectDialog(true);
              }}
            >
              <XCircle className="w-4 h-4" />
              Reject
            </button>
          </div>
        </div>
      )}

      {showEditButton && (
        <div className="mt-4 space-y-3">
          <div className="flex gap-3">
            <button
              disabled={loadingApprove}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-accent/80 hover:bg-accent/70 text-white rounded-lg font-medium transition-colors hover:cursor-pointer"
              onClick={handleReopenClick}
            >
              <Edit2 className="w-4 h-4" />
              Reopen request
            </button>
          </div>
        </div>
      )}

      <ApproveDialog
        open={showApproveDialog}
        onOpenChange={setShowApproveDialog}
        request={request}
      />
      <RejectDialog
        open={showRejectDialog}
        onOpenChange={setShowRejectDialog}
        request={request}
      />
    </div>
  );
}
