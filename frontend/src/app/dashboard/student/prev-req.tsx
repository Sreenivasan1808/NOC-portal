"use client";

import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { getSession } from "@/lib/auth";
import { Check, Hourglass, RefreshCcw, X } from "lucide-react";
import Link from "next/link";

const statusIcons = {
  Pending: <Hourglass />,
  Approved: <Check />,
  Rejected: <X />,
};

const statusColors = {
  Pending: "text-secondary",
  Approved: "text-primary",
  Rejected: "text-red-500",
};

export default function PreviousRequests({
  rollNumber,
  initialData,
}: {
  rollNumber: string;
  initialData?: unknown;
}) {
  const base = (process.env.NEXT_PUBLIC_SERVER_URL ||
    process.env.SERVER_URL) as string;

  const fetchRequests = async () => {
    const session = await getSession();
    const resp = await axios.get(`${base}/api/requests/student/${rollNumber}`, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${session}` },
    });
    return resp.data;
  };

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["studentRequests", rollNumber],
    queryFn: fetchRequests,
    initialData: initialData as unknown,
    // keep data relatively fresh
    refetchOnWindowFocus: true,
  });

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Your previous requests</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="px-3 py-1 rounded bg-background-muted hover:bg-background-muted/80 hover:cursor-pointer flex gap-1"
          >
            <RefreshCcw />
            Refresh
          </button>
          {isFetching && (
            <span className="text-sm text-foreground-muted">Refreshing…</span>
          )}
        </div>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div className="text-red-600">Failed to load requests.</div>
      ) : (
        <div className="space-y-4">
          {Array.isArray(data.previous) && data.previous.length ? (
            data.previous.map(
              (req: { _id: string; createdAt: Date; status: string }) => (
                <div
                  key={req._id}
                  className="bg-background-muted p-4 rounded-lg md:w-96 md:h-72"
                >
                  <div className="flex justify-between">
                    <div>
                      <div className="font-semibold">Request ID: {req._id}</div>
                      <div className="text-sm text-foreground-muted">
                        Requested date:{" "}
                        {new Date(req.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-sm font-medium flex flex-col justify-end items-center gap-2">
                        <Link href={""} className="hover:text-foreground-muted">View details</Link>
                      <div className="flex items-center">
                        Status:{" "}
                        <span
                          className={`flex gap-1 justify-center items-center ${
                            statusColors[req.status]
                          }`}
                        >
                          {statusIcons[req.status]} {req.status ?? "Unknown"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )
          ) : (
            <div>No requests found.</div>
          )}
        </div>
      )}
    </div>
  );
}
