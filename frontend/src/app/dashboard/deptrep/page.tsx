"use client";
import Navbar from "@/components/navbar";
import { useState } from "react";
import {
  FileText,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Edit3,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser, getSession } from "@/lib/auth";
import axios from "axios";

const DepartmentRepresentativeDashboard = () => {
  const [activeTab, setActiveTab] = useState("requests");
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState<string | null>(
    null
  );
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);

  const queryClient = useQueryClient();


  const {
    data = [],
    isLoading,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["deptRepRequests"],
    queryFn: async () => {
      const session = await getSession();
      if (!session) throw new Error("No session token");

      const base = process.env.NEXT_PUBLIC_SERVER_URL ?? "";
      const sanitizedBase = base.replace(/\/$/, "");

      console.log("Fetching department rep requests from", sanitizedBase);

      // fetch requests for deptrep
      const response = await axios.get(
        `${sanitizedBase}/api/requests/deptrep`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session}`,
          },
          withCredentials: true,
        }
      );

      const requests = response.data.requests || [];
      
      console.log("Requests raw:", requests);

      // attach student data
      const enriched = await Promise.all(
        requests.map(async (req: any) => {
          try {
            // try to read studentRollNumber or rollNumber
            const roll =
              req.studentRollNumber ?? req.rollNumber ?? req.student?.roll;
            if (!roll) {
              console.log("No roll found for request", req._id ?? req.id);
              return req;
            }

            const studentRes = await axios.get(
              `${sanitizedBase}/api/users/student/${encodeURIComponent(roll)}`
            );

            return {
              ...req,
              studentData: studentRes.data,
            };
          } catch (err) {
            console.error(
              "Student fetch failed for request",
              req._id ?? req.id,
              err
            );
            return req;
          }
        })
      );

      return enriched;
    },
    staleTime: 1000 * 60,
    retry: 1,
  });

  const handleApproveClick = (request: any) => {
    const id = request._id ?? request.id;
    setCurrentRequestId(id);
    setSelectedRequest(request);
    setShowApproveDialog(true);
    console.log("Open approve dialog for", id);
  };

  const handleRejectClick = (request: any) => {
    const id = request._id ?? request.id;
    setCurrentRequestId(id);
    setSelectedRequest(request);
    setRejectionReason("");
    setShowRejectDialog(true);
    console.log("Open reject dialog for", id);
  };

  const handleApproveConfirm = async () => {
    if (!currentRequestId) return;
    try {
      const session = await getSession();
      if (!session) throw new Error("No session token");

      const base = process.env.NEXT_PUBLIC_SERVER_URL ?? "";
      const sanitizedBase = base.replace(/\/$/, "");
      console.log("Approving request", currentRequestId);

      await axios.post(
        `${sanitizedBase}/api/requests/${encodeURIComponent(
          currentRequestId
        )}/approve`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session}`,
          },
          withCredentials: true,
        }
      );

      // refresh requests list
      queryClient.invalidateQueries({ queryKey: ["deptRepRequests"] });

      setShowApproveDialog(false);
      setCurrentRequestId(null);
      setSelectedRequest(null);
      console.log("Approved request:", currentRequestId);
    } catch (err) {
      console.error("Approve failed:", err);
      // keep dialog open for debugging/retry
    }
  };

  const handleRejectConfirm = async () => {
    if (!currentRequestId) return;
    try {
      const session = await getSession();
      if (!session) throw new Error("No session token");

      const base = process.env.NEXT_PUBLIC_SERVER_URL ?? "";
      const sanitizedBase = base.replace(/\/$/, "");
      console.log("Rejecting request", currentRequestId, "reason:", rejectionReason);

      await axios.post(
        `${sanitizedBase}/api/requests/${encodeURIComponent(
          currentRequestId
        )}/reject`,
        { comment: rejectionReason },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session}`,
          },
          withCredentials: true,
        }
      );

      // refresh requests list
      queryClient.invalidateQueries({ queryKey: ["deptRepRequests"] });

      setShowRejectDialog(false);
      setCurrentRequestId(null);
      setSelectedRequest(null);
      setRejectionReason("");
      console.log("Rejected request:", currentRequestId);
    } catch (err) {
      console.error("Reject failed:", err);
      // keep dialog open for debugging/retry
    }
  };

  const getStatusIcon = (status: string) => {
    const s = (status ?? "").toString().toLowerCase();
    switch (s) {
      case "pending":
        return <Clock className="w-5 h-5 text-amber-500" />;
      case "approved":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    if (!status) return "";
    const s = status.toString();
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-foreground-muted">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error("Failed to load deptrep requests:", error);
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border bg-card shadow-sm">
          <div className="p-6">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab("requests")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all hover:cursor-pointer hover:bg-secondary ${
                  activeTab === "requests"
                    ? "bg-accent text-white shadow-md "
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <FileText className="w-5 h-5" />
                Requests
              </button>
              <button
                onClick={() => setActiveTab("students")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all hover:cursor-pointer hover:bg-secondary ${
                  activeTab === "students"
                    ? "bg-accent text-white shadow-md "
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <Users className="w-5 h-5" />
                Students
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            {activeTab === "requests" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-foreground">
                    Department Requests
                  </h2>
                  <p className="text-foreground-muted mt-1">
                    Manage department requests and student details
                  </p>
                </div>

                {Array.isArray(data) && data.length > 0 ? (
                  <div className="space-y-4">
                    {data.map(async (request: any) => {
                      // Support both _id and id fields
                      const reqId = request._id ?? request.id;
                      const status = request.status ?? request.state ?? "Pending";
                      const me = await getCurrentUser();
                      const myDepartment = me.department;
                      // Find my department’s approval object
                      const myDeptApproval = request.departmentApprovals.find(
                        dept => dept.department === myDepartment
                      );

                      const faApproved = String(request.status).toLowerCase() === "fa approved";
                      const isPending = myDeptApproval?.status?.toLowerCase() === "pending";



                      console.log("Rendering request", reqId, request);

                      return (
                        <div
                          key={reqId}
                          className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold text-foreground">
                                  {request.name ?? request.title ?? "Student Request"}
                                </h3>
                                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-muted">
                                  {getStatusIcon(status)}
                                  <span className="text-sm font-medium text-foreground">
                                    {getStatusLabel(status)}
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
                                  <p className="text-foreground font-medium">#{reqId}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-foreground-muted uppercase tracking-wide">
                                    Roll Number
                                  </p>
                                  <p className="text-foreground font-medium">
                                    {request.studentRollNumber ?? request.rollNumber ?? "—"}
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
                              </div>

                              <p className="text-sm text-foreground-muted mt-3">
                                Submitted on {request.createdAt ?? request.submittedAt ?? "—"}
                              </p>
                            </div>
                          </div>

                          {/* Action Buttons - Pending */}
                          {faApproved && isPending && (
                            <div className="mt-6 border-t border-border pt-4">
                              <div className="flex gap-3">
                                <button
                                  onClick={() => handleApproveClick(request)}
                                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors hover:cursor-pointer"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleRejectClick(request)}
                                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors hover:cursor-pointer"
                                >
                                  <XCircle className="w-4 h-4" />
                                  Reject
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Action Buttons - Non-Pending (Approved/Rejected) */}
                          {
                          String(status).toLowerCase() !== "fully approved" && (
                            <div className="mt-6 space-y-4 border-t border-border pt-4">
                              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground hover:opacity-90 rounded-lg font-medium transition-colors">
                                <Edit3 className="w-4 h-4" />
                                Edit Request
                              </button>

                              {myDeptApproval?.status?.toLowerCase() === "rejected" &&
                                request.comment && (
                                  <div>
                                    <label className="text-sm font-semibold text-foreground block mb-2">
                                      Rejection Reason
                                    </label>
                                    <textarea
                                      disabled
                                      className="w-full px-3 py-2 border border-border rounded-lg bg-muted text-foreground-muted cursor-not-allowed resize-none"
                                      rows={2}
                                      defaultValue={request.comment}
                                    />
                                  </div>
                                )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-1 items-center justify-center">
                    <p className="text-foreground-muted">
                      {isFetching ? "Refreshing..." : "No requests found."}
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "students" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-foreground">Students</h2>
                  <p className="text-foreground-muted mt-1">
                    View student information
                  </p>
                </div>

                <div className="grid gap-4">
                  {/* If you want to render real students, replace this mock with actual student data */}
                  <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-foreground mb-2">
                          Student List Placeholder
                        </h3>
                        <p className="text-foreground-muted">Implement student listing here.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Approve Confirmation Dialog */}
      <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Approval</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this request? This action will
              notify the student.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-background-muted hover:cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApproveConfirm}
              className="bg-primary hover:bg-primary/80 hover:cursor-pointer"
            >
              Approve
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog with Reason */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this request. This will be
              shared with the student.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-semibold text-foreground block mb-2">
              Rejection Reason
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              placeholder="Enter rejection reason..."
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleRejectConfirm}
              className="bg-red-500 hover:bg-red-600 text-white"
              disabled={!rejectionReason.trim()}
            >
              Reject Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DepartmentRepresentativeDashboard;
