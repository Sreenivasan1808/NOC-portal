"use client";

import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { getSession } from "@/lib/auth";
import { RefreshCcw } from "lucide-react";

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
            <RefreshCcw />Refresh
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
            data.map((req: any) => (
              <div
                key={req._id || req.id}
                className="bg-background-muted p-4 rounded-lg"
              >
                <div className="flex justify-between">
                  <div>
                    <div className="font-semibold">
                      Request ID: {req._id || req.id}
                    </div>
                    <div className="text-sm text-foreground-muted">
                      Date: {new Date(req.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-sm font-medium">
                    Status: {req.status ?? "Unknown"}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div>No requests found.</div>
          )}
        </div>
      )}
    </div>
  );
}
