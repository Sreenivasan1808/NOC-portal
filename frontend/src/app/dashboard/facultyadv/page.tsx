"use client";
import Navbar from "@/components/navbar";
import { useState } from "react";
import axios from "axios";
import { getSession } from "@/lib/auth";
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
import { useQuery } from "@tanstack/react-query";


const FacultyAdvisorDashboard = () => {
  const [activeTab, setActiveTab] = useState("requests");
  const [selectedRequest, setSelectedRequest] = useState<number | null>(null);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [currentRequestId, setCurrentRequestId] = useState<number | null>(null);

  // Sample data
  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["facultyRequests"],
    queryFn: async () => {
      const session = await getSession();
      if (!session) throw new Error("No session token");

      const base = process.env.NEXT_PUBLIC_SERVER_URL ?? "";
      const sanitizedBase = base.replace(/\/$/, "");

      // Fetch faculty requests
      const response = await axios.get(
        `${sanitizedBase}/api/requests/faculty`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session}`,
          },
          withCredentials: true,
        }
      );

      const requests = response.data.requests || [];

      // Fetch and attach student data for each request
      const enrichedRequests = await Promise.all(
        requests.map(async (req: any) => {
          try {
            const studentRes = await axios.get(
              `${sanitizedBase}/api/users/student/${req.studentRollNumber}`
            );

            return {
              ...req,
              studentData: studentRes.data, // attached here ✅
            };
          } catch (err) {
            console.error(
              "Student fetch failed for roll:",
              req.studentRollNumber,
              err
            );
            return req; // fallback if student lookup fails
          }
        })
      );

      return enrichedRequests;
    },
    staleTime: 1000 * 60,
    retry: 1,
  });

  // optional: show loading/error in UI (kept minimal here)
  if (isLoading) {
    // while loading, show empty array so rest of UI doesn't crash
    return <div>Loading...</div>;
  }
  if (error) {
    console.error("Failed to load faculty requests:", error);
  }

  const students = [
    {
      id: 1,
      name: "John Doe",
      rollNo: "CS2025001",
      department: "Computer Science",
      email: "john.doe@university.edu",
    },
    {
      id: 2,
      name: "Jane Smith",
      rollNo: "EC2025005",
      department: "Electronics",
      email: "jane.smith@university.edu",
    },
  ];

  const handleApproveClick = (requestId: number) => {
    setCurrentRequestId(requestId);
    setShowApproveDialog(true);
  };

  const handleRejectClick = (requestId: number) => {
    setCurrentRequestId(requestId);
    setRejectionReason("");
    setShowRejectDialog(true);
  };

  const handleApproveConfirm = async () => {
    try {
      const session = await getSession();
      const base = (process.env.NEXT_PUBLIC_SERVER_URL || process.env.SERVER_URL) as string;
      if (!currentRequestId) return;
      await axios.post(
        `${base}/api/requests/${currentRequestId}/approve`,
        {},
        { withCredentials: true, headers: { Authorization: `Bearer ${session}` } }
      );
      console.log("Approved request:", currentRequestId);
    } catch (e) {
      console.error("Approve failed", e);
    } finally {
      setShowApproveDialog(false);
      setCurrentRequestId(null);
    }
  };

  const handleRejectConfirm = async () => {
    try {
      const session = await getSession();
      const base = (process.env.NEXT_PUBLIC_SERVER_URL || process.env.SERVER_URL) as string;
      if (!currentRequestId) return;
      await axios.post(
        `${base}/api/requests/${currentRequestId}/reject`,
        { rejectionReason },
        { withCredentials: true, headers: { Authorization: `Bearer ${session}` } }
      );
      console.log("Rejected request:", currentRequestId, "Reason:", rejectionReason);
    } catch (e) {
      console.error("Reject failed", e);
    } finally {
      setShowRejectDialog(false);
      setCurrentRequestId(null);
      setRejectionReason("");
    }
  };

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
                    Student Requests
                  </h2>
                  <p className="text-foreground-muted mt-1">
                    Manage and review student requests
                  </p>
                </div>

                {data.length > 0 ? (
                  <div className="space-y-4">
                    {data.map((request: any) => {
                      console.log(data);

                      return (
                        <div
                          key={request.id}
                          className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold text-foreground">
                                  {request.name}
                                </h3>
                                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-muted">
                                  {getStatusIcon(request.status)}
                                  <span className="text-sm font-medium text-foreground">
                                    {getStatusLabel(request.status)}
                                  </span>
                                </div>
                              </div>
                                <h2 className="py-4 text-2xl font-semibold leading-none tracking-tight text-foreground">
                                  {request.studentData.name}
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
                                    {request.studentData.department}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-foreground-muted uppercase tracking-wide">
                                    Program
                                  </p>
                                  <p className="text-foreground font-medium">
                                    {request.studentData.program}
                                  </p>
                                </div>
                              </div>
                              <p className="text-sm text-foreground-muted mt-3">
                                Submitted on {request.createdAt}
                              </p>
                            </div>
                          </div>

                          {/* Action Buttons - Pending */}
                          {request.status === "Pending" && (
                            <div className="mt-6 border-t border-border pt-4">
                              <div className="flex gap-3">
                                <button
                                  onClick={() => handleApproveClick(request.id)}
                                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors hover:cursor-pointer"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleRejectClick(request.id)}
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
                              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground hover:opacity-90 rounded-lg font-medium transition-colors">
                                <Edit3 className="w-4 h-4" />
                                Edit Request
                              </button>
                              {request.status === "rejected" &&
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
                    <p className="text-foreground-muted">No requests found.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "students" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-foreground">
                    Students
                  </h2>
                  <p className="text-foreground-muted mt-1">
                    View student information
                  </p>
                </div>

                <div className="grid gap-4">
                  {students.map((student) => (
                    <div
                      key={student.id}
                      className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-foreground mb-2">
                            {student.name}
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-foreground-muted uppercase tracking-wide">
                                Roll Number
                              </p>
                              <p className="text-foreground font-medium">
                                {student.rollNo}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-foreground-muted uppercase tracking-wide">
                                Department
                              </p>
                              <p className="text-foreground font-medium">
                                {student.department}
                              </p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-xs text-foreground-muted uppercase tracking-wide">
                                Email
                              </p>
                              <p className="text-foreground font-medium">
                                {student.email}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
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
            <Button
              variant="outline"
              onClick={() => setShowRejectDialog(false)}
            >
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

export default FacultyAdvisorDashboard;
