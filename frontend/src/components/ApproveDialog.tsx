"use client";
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
import { getSession } from "@/lib/auth";
import axios from "axios";
import { useDeptRepRequests } from "../app/dashboard/deptrep/(hooks)/useDeptRepRequests";
import { useState } from "react";
import { INoDueReq } from "@/types/types";

export default function ApproveDialog({
  open,
  onOpenChange,
  request,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: (INoDueReq & { _id?: string });
}) {
  const [loading, setLoading] = useState(false);
  const { refresh } = useDeptRepRequests();

  const handleApprove = async () => {
    if (!request) return;

    try {
      setLoading(true);
      const session = await getSession();
      if (!session) throw new Error("Missing session token");

      const base = process.env.NEXT_PUBLIC_SERVER_URL ?? "";
      const sanitizedBase = base.replace(/\/$/, "");
      const reqId = encodeURIComponent(request._id?.toString() ?? "");

      await axios.post(
        `${sanitizedBase}/api/requests/${reqId}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${session}` },
          withCredentials: true,
        }
      );

      refresh();
    } catch (error) {
      console.error("Approve failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Approval</AlertDialogTitle>
          <AlertDialogDescription>
            Approving this request will notify the student.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading} className="hover:cursor-pointer">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleApprove}
            className="bg-primary hover:bg-green-500/80 hover:cursor-pointer"
            disabled={loading}
          >
            {loading ? "Approving..." : "Approve"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
