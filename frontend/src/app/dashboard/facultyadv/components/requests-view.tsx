"use client";
import { Clock, CheckCircle2, XCircle, Edit3 } from "lucide-react";
import axios from "axios";
import { getSession } from "@/lib/auth";
import { toast } from "sonner";
import { INoDueReq, IStudent } from "@/types/types";

interface RequestsViewProps {
  requests: (INoDueReq & { _id: string; studentData: IStudent })[];
  isLoading: boolean;
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
  refresh: () => Promise<void>;
}

const formatDate = (d: Date) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleString();
  } catch {
    return String(d);
  }
};

export function RequestsView({
  requests,
  isLoading,
  onApprove,
  onReject,
  refresh,
}: RequestsViewProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return <Clock className="w-5 h-5 text-amber-500" />;
      case "Approved":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "Rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleReopenClick = async (id: string) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/requests/reopen/${id}`,
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

  return (
    <div className="space-y-6">
      {requests.length > 0 ? (
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request._id}
              className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-muted">
                      {getStatusIcon(request.status)}
                      <span className="text-sm font-medium text-foreground">
                        {getStatusLabel(request.status)}
                      </span>
                    </div>
                  </div>
                  <h2 className="py-4 text-2xl font-semibold leading-none tracking-tight text-foreground">
                    {request.studentData?.name}
                  </h2>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-foreground-muted uppercase tracking-wide">
                        Request ID
                      </p>
                      <p className="text-foreground font-medium">
                        #{request._id}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-foreground-muted uppercase tracking-wide">
                        Roll Number
                      </p>
                      <p className="text-foreground font-medium">
                        {request.studentRollNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-foreground-muted uppercase tracking-wide">
                        Department
                      </p>
                      <p className="text-foreground font-medium">
                        {request.studentData?.department}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-foreground-muted uppercase tracking-wide">
                        Program
                      </p>
                      <p className="text-foreground font-medium">
                        {request.studentData?.program}
                      </p>
                    </div>
                    {request?.facultyAdvisorApproval?.status === "Rejected" && (
                      <div className="flex flex-col gap-2">
                        <p className="text-xs text-foreground-muted uppercase tracking-wide">
                          Rejection reason
                        </p>
                        {/* <p className="text-foreground font-medium">
                          {request?.facultyAdvisorApproval.rejectionReason ?? "-"}
                        </p> */}
                        <textarea
                          disabled
                          className="w-full px-3 py-2 border border-border rounded-lg bg-muted text-foreground-muted cursor-not-allowed resize-none"
                          rows={2}
                          defaultValue={
                            request?.facultyAdvisorApproval.rejectionReason ??
                            "-"
                          }
                        />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-foreground-muted mt-3">
                    Submitted on {formatDate(request?.createdAt ?? new Date())}
                  </p>
                </div>
              </div>

              {/* Action Buttons - Pending */}
              {request.status === "Pending" && (
                <div className="mt-6 border-t border-border pt-4">
                  <div className="flex gap-3">
                    <button
                      onClick={() => onApprove(request._id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors hover:cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => onReject(request._id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors hover:cursor-pointer"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons - Non-Pending (Approved/Rejected) */}
              {request.status !== "Pending" && (
                <div className="mt-6 space-y-4 border-t border-border pt-4">
                  <button
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground hover:opacity-90 rounded-lg font-medium transition-colors hover:cursor-pointer"
                    onClick={async () => await handleReopenClick(request._id)}
                  >
                    <Edit3 className="w-4 h-4" />
                    Reopen Request
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-foreground-muted">No requests found.</p>
        </div>
      )}
    </div>
  );
}
