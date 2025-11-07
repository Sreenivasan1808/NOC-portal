"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Users,
  Edit3,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getSession, getCurrentUser } from "@/lib/auth";


export default function RequestCard({ request }: { request: any }) {
  const queryClient = useQueryClient();

  // UI state
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [localRemarks, setLocalRemarks] = useState<string>("");
  const [rejectReason, setRejectReason] = useState<string>("");
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);

  // load current user (to read user.department)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const user = await getCurrentUser(); // expected to return { department, ... }
        if (mounted) setCurrentUser(user);
      } catch (err) {
        console.error("getCurrentUser failed", err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // find this user's department approval entry index (if any)
  const deptIndex = useMemo(() => {
    const dept = currentUser?.department;
    if (!dept || !Array.isArray(request?.departmentApprovals)) return -1;
    return request.departmentApprovals.findIndex(
      (d: any) => String(d.department).toLowerCase() === String(dept).toLowerCase()
    );
  }, [currentUser, request]);

  // initial local remarks from the DB for this dept
  useEffect(() => {
    if (deptIndex >= 0) {
      const existing =
        request.departmentApprovals?.[deptIndex]?.remarks ?? "";
      setLocalRemarks(existing);
    } else {
      setLocalRemarks("");
    }
  }, [deptIndex, request]);

  // helpers
  const formatDate = (d: any) => {
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
      case "approved":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string | undefined) => {
    if (!status) return "";
    const s = status.toString();
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  // whether we should show action buttons (require overall status exactly 'FA Approved')
  const showActions =
    String(request?.status ?? "").toLowerCase() === "fa approved" &&
    deptIndex >= 0;

  // Approve handler
  const handleApprove = async () => {
    if (!showActions) return;
    setLoadingApprove(true);
    try {
      const session = await getSession();
      if (!session) throw new Error("No session token");

      const base = process.env.NEXT_PUBLIC_SERVER_URL ?? "";
      const sanitizedBase = base.replace(/\/$/, "");
      const reqId = encodeURIComponent(request._id ?? request.id);

      // include remarks, so backend can update departmentApprovals[].remarks
      await axios.post(
        `${sanitizedBase}/api/requests/${reqId}/approve`,
        { remarks: localRemarks },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session}`,
          },
          withCredentials: true,
        }
      );

      // refresh the list
      queryClient.invalidateQueries({ queryKey: ["deptRepRequests"] });
    } catch (err) {
      console.error("Approve failed:", err);
    } finally {
      setLoadingApprove(false);
    }
  };

  // Reject handler
  const handleReject = async () => {
    if (!showActions) return;
    if (!rejectReason.trim()) return;
    setLoadingReject(true);
    try {
      const session = await getSession();
      if (!session) throw new Error("No session token");

      const base = process.env.NEXT_PUBLIC_SERVER_URL ?? "";
      const sanitizedBase = base.replace(/\/$/, "");
      const reqId = encodeURIComponent(request._id ?? request.id);

      await axios.post(
        `${sanitizedBase}/api/requests/${reqId}/reject`,
        { comment: rejectReason },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session}`,
          },
          withCredentials: true,
        }
      );

      // refresh the list
      queryClient.invalidateQueries({ queryKey: ["deptRepRequests"] });
      setRejectReason("");
    } catch (err) {
      console.error("Reject failed:", err);
    } finally {
      setLoadingReject(false);
    }
  };

  // UI pieces: attachments rendering
  const renderAttachments = () => {
    const atts = request.attachments ?? request.files ?? [];
    if (!Array.isArray(atts) || atts.length === 0) {
      return <p className="text-sm text-foreground-muted">No attachments.</p>;
    }

    return (
      <ul className="space-y-2">
        {atts.map((a: any, idx: number) => {
          const name = a.filename ?? a.name ?? a;
          const url = a.url ?? a.fileUrl ?? a;
          return (
            <li key={idx}>
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="text-sm underline hover:opacity-90"
              >
                {name}
              </a>
            </li>
          );
        })}
      </ul>
    );
  };

  // Approval timeline: faculty advisor + each department approval
  const renderTimeline = () => {
    const fa = request.facultyAdvisorApproval;
    const depts = request.departmentApprovals ?? [];
    return (
      <div className="mt-4">
        <h4 className="text-sm font-semibold text-foreground mb-2">Approval Timeline</h4>
        <div className="space-y-3">
          {/* Faculty Advisor */}
          <div className="flex items-start gap-3">
            <div className="mt-1">{getStatusIcon(fa?.status)}</div>
            <div>
              <div className="text-sm font-medium text-foreground">
                Faculty Advisor — {getStatusLabel(fa?.status)}
              </div>
              <div className="text-xs text-foreground-muted">
                Approver ID: {fa?.approverId ?? "—"} • {formatDate(fa?.date)}
              </div>
              {fa?.rejectionReason && (
                <div className="text-sm text-red-600 mt-1">Reason: {fa.rejectionReason}</div>
              )}
            </div>
          </div>

          {/* Department approvals */}
          {depts.map((d: any, i: number) => (
            <div key={i} className="flex items-start gap-3">
              <div className="mt-1">{getStatusIcon(d?.status)}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-foreground">
                    {d.department} — {getStatusLabel(d?.status)}
                  </div>
                  <div className="text-xs text-foreground-muted">{formatDate(d?.date)}</div>
                </div>

                <div className="text-xs text-foreground-muted">
                  Approver ID: {d?.approverId ?? "—"}
                </div>

                {d?.remarks && (
                  <div className="mt-1">
                    <label className="text-xs font-semibold text-foreground block mb-1">
                      Remarks
                    </label>
                    <div className="text-sm text-foreground-muted whitespace-pre-wrap">
                      {d.remarks}
                    </div>
                  </div>
                )}

                {d?.rejectionReason && (
                  <div className="mt-1 text-sm text-red-600">Rejection Reason: {d.rejectionReason}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-foreground">
              {request.name ?? request.title ?? "Student Request"}
            </h3>
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-muted">
              {getStatusIcon(request.status)}
              <span className="text-sm font-medium text-foreground">
                {getStatusLabel(request.status)}
              </span>
            </div>
          </div>

          <h2 className="py-4 text-2xl font-semibold leading-none tracking-tight text-foreground">
            {request.studentData?.name ?? "—"}
          </h2>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-xs text-foreground-muted uppercase tracking-wide">Request ID</p>
              <p className="text-foreground font-medium">#{request._id ?? request.id}</p>
            </div>
            <div>
              <p className="text-xs text-foreground-muted uppercase tracking-wide">Roll Number</p>
              <p className="text-foreground font-medium">
                {request.studentRollNumber ?? request.rollNumber ?? request.student?.roll ?? "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-foreground-muted uppercase tracking-wide">Department</p>
              <p className="text-foreground font-medium">
                {request.studentData?.department ?? request.department ?? "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-foreground-muted uppercase tracking-wide">Program</p>
              <p className="text-foreground font-medium">{request.studentData?.program ?? "—"}</p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm text-foreground-muted">
              Submitted on {formatDate(request.createdAt ?? request.submittedAt)}
            </p>
            {/* other request-specific fields */}
            <div className="mt-3 space-y-2">
              <div>
                <p className="text-xs text-foreground-muted uppercase tracking-wide">Letter Type</p>
                <p className="text-foreground font-medium">{request.type ?? request.letterType ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs text-foreground-muted uppercase tracking-wide">Purpose</p>
                <p className="text-foreground font-medium">{request.purpose ?? request.reason ?? request.body ?? "—"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attachments */}
      <div className="mt-4 border-t border-border pt-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            <h4 className="text-sm font-semibold text-foreground">Attachments</h4>
          </div>
        </div>
        {renderAttachments()}
      </div>

      {/* Timeline */}
      {renderTimeline()}

      {/* Dept remarks editable area + action buttons (only for this dept) */}
      {deptIndex >= 0 && (
        <div className="mt-6 border-t border-border pt-4">
          <label className="text-sm font-semibold text-foreground block mb-2">
            Your Remarks ({currentUser?.department ?? "Department"})
          </label>

          <textarea
            value={localRemarks}
            onChange={(e) => setLocalRemarks(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            placeholder="Add remarks for this student's request..."
            rows={3}
          />

          {/* Show rejection reason input if rejecting */}
          {showActions && (
            <div className="mt-4 space-y-3">
              <div className="flex gap-3">
                <button
                  onClick={handleApprove}
                  disabled={loadingApprove}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors hover:cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {loadingApprove ? "Approving..." : "Approve"}
                </button>

                <button
                  onClick={() => setRejectReason((r) => r)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors hover:cursor-pointer"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
              </div>

              {/* Reject reason + confirm */}
              <div>
                <label className="text-sm font-semibold text-foreground block mb-2">
                  Rejection Reason (required to reject)
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-destructive focus:border-transparent resize-none"
                  placeholder="Enter reason for rejection..."
                  rows={2}
                />
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={handleReject}
                    disabled={!rejectReason.trim() || loadingReject}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                  >
                    {loadingReject ? "Rejecting..." : "Confirm Reject"}
                  </button>
                  <button
                    onClick={() => setRejectReason("")}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* If actions not allowed (eg. not FA Approved) show a small note */}
          {!showActions && (
            <div className="mt-4 text-sm text-foreground-muted">
              Actions are available only when the overall status is <strong>FA Approved</strong>.
            </div>
          )}
        </div>
      )}

      {/* After final approval (fully approved) show edit button area similar to FA UI */}
      {String(request?.status ?? "").toLowerCase() !== "fully approved" && (
        <div className="mt-6 space-y-4 border-t border-border pt-4">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground hover:opacity-90 rounded-lg font-medium transition-colors">
            <Edit3 className="w-4 h-4" />
            Edit Request
          </button>
        </div>
      )}
    </div>
  );
}
