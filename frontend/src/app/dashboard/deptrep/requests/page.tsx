"use client";
import { LoaderCircle } from "lucide-react";
import RequestCard from "../(components)/RequestCard";
import { useDeptRepRequests } from "../(hooks)/useDeptRepRequests";


export default function RequestsTab() {
  const { data, isLoading, isFetching } = useDeptRepRequests();

  if (isLoading)
    return (
      <div className="min-h-screen w-full flex justify-center items-center gap-2">
        <LoaderCircle className="animate-spin" />
        Loading...
      </div>
    );

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="p-8">
        {Array.isArray(data) && data.length > 0 ? (
          <div className="space-y-4">
            {data.pending_requests.map(
              (req) => (
                <RequestCard key={req._id} request={req} />
              )
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center text-foreground-muted">
            {isFetching ? "Refreshing..." : "No requests found."}
          </div>
        )}
      </div>
    </main>
  );
}
