"use client";
import { RequestsView } from "../components/requests-view";
import { RequestDialogs } from "../components/request-dialogs";
import { useFacultyRequests } from "../hooks/useFacultyRequests";
import { useState } from "react";
import { getSession } from "@/lib/auth";
import axios from "axios";

export default function FacultyRequestsPage() {
  const { data, isLoading, refresh } = useFacultyRequests();
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [currentRequestId, setCurrentRequestId] = useState<string | null>(null);

  const handleApproveClick = (id: string) => {
    setCurrentRequestId(id);
    setShowApproveDialog(true);
  };

  const handleRejectClick = (id: string) => {
    setCurrentRequestId(id);
    setRejectionReason("");
    setShowRejectDialog(true);
  };

  const handleApproveConfirm = async () => {
    try {
      const session = await getSession();
      const base = (process.env.NEXT_PUBLIC_SERVER_URL ||
        process.env.SERVER_URL) as string;
      if (!currentRequestId) return;
      await axios.post(
        `${base}/api/requests/${currentRequestId}/approve`,
        {},
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${session}` },
        }
      );
    } catch (err) {
      console.error(err);
    } finally {
      setShowApproveDialog(false);
      setCurrentRequestId(null);
      refresh?.();
    }
  };

  const handleRejectConfirm = async () => {
    try {
      const session = await getSession();
      const base = (process.env.NEXT_PUBLIC_SERVER_URL ||
        process.env.SERVER_URL) as string;
      if (!currentRequestId) return;
      await axios.post(
        `${base}/api/requests/${currentRequestId}/reject`,
        { rejectionReason },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${session}` },
        }
      );
    } catch (err) {
      console.error(err);
    } finally {
      setShowRejectDialog(false);
      setCurrentRequestId(null);
      setRejectionReason("");
      refresh?.();
    }
  };

  if (isLoading) return <div className="p-8">Loading…</div>;

  const pending = data?.pending ?? [];
  const completed = data?.completed ?? [];

  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Pending Requests</h2>
        <p className="text-foreground-muted mt-1">
          Requests awaiting your action
        </p>
      </div>

      <RequestsView
        requests={pending}
        isLoading={false}
        onApprove={handleApproveClick}
        onReject={handleRejectClick}
        refresh={refresh}
      />

      <div className="pt-8">
        <h2 className="text-3xl font-bold text-foreground">
          Completed Requests
        </h2>
        <p className="text-foreground-muted mt-1">
          Requests you have already processed
        </p>
      </div>

      <RequestsView
        requests={completed}
        isLoading={false}
        onApprove={() => {}}
        onReject={() => {}}
        refresh={refresh}
      />

      <RequestDialogs
        showApproveDialog={showApproveDialog}
        showRejectDialog={showRejectDialog}
        rejectionReason={rejectionReason}
        onApproveConfirm={handleApproveConfirm}
        onRejectConfirm={handleRejectConfirm}
        onApproveDialogChange={setShowApproveDialog}
        onRejectDialogChange={setShowRejectDialog}
        onRejectionReasonChange={setRejectionReason}
      />
    </div>
  );
}
