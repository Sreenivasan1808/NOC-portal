"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth";
import axios from "axios";
import { useState } from "react";
import { useDeptRepRequests } from "../app/dashboard/deptrep/(hooks)/useDeptRepRequests";
import { INoDueReq } from "@/types/types";

export default function RejectDialog({open, onOpenChange, request }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: (INoDueReq & { _id?: string });
}) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const { refresh } = useDeptRepRequests();

  const handleReject = async () => {
    if (!request || !reason.trim()) return;

    try {
      setLoading(true);
      const session = await getSession();
      if (!session) throw new Error("Missing session token");

      const base = process.env.NEXT_PUBLIC_SERVER_URL ?? "";
      const sanitizedBase = base.replace(/\/$/, "");
      const reqId = encodeURIComponent(request._id?.toString() ?? "");

      await axios.post(
        `${sanitizedBase}/api/requests/${reqId}/reject`,
        { comment: reason },
        {
          headers: { Authorization: `Bearer ${session}` },
          withCredentials: true,
        }
      );

      refresh();
      setReason("");
      onOpenChange(false);
    } catch (error) {
      console.error("Reject failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Request</DialogTitle>
          <DialogDescription>
            Please provide a reason for rejecting this request.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <label className="text-sm font-medium block mb-2">
            Reason
          </label>
          <textarea
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-destructive resize-none"
            rows={4}
            value={reason}
            disabled={loading}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter rejection reason..."
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() =>onOpenChange(false)} disabled={loading} className="hover:cursor-pointer">
            Cancel
          </Button>
          <Button
            className="bg-red-500 hover:bg-red-600 text-white hover:cursor-pointer"
            onClick={handleReject}
            disabled={!reason.trim() || loading}
          >
            {loading ? "Rejecting..." : "Reject Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
