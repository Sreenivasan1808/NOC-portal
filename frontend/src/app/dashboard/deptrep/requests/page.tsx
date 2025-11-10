"use client";
import { Inbox, Loader2, LoaderCircle } from "lucide-react";
import RequestCard from "../(components)/RequestCard";
import { useDeptRepRequests } from "../(hooks)/useDeptRepRequests";

export default function RequestsTab() {
  const { data, isLoading, isFetching, error, refresh } = useDeptRepRequests();

  if (isLoading)
    return (
      <div className="min-h-screen w-full flex justify-center items-center gap-2">
        <LoaderCircle className="animate-spin" />
        Loading...
      </div>
    );

  if(error)
    return(
      <div className="min-h-screen w-full flex justify-center items-center gap-2">
        {error.toString()}
      </div>
    )

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="p-8">
        <h2 className="text-2xl font-semibold text-foreground mb-4">
          Your Pending Requests
        </h2>
        {data &&
        Array.isArray(data.pending_requests) &&
        data.pending_requests.length > 0 ? (
          <div className="space-y-4">
            {data.pending_requests
              .filter((req) => "studentData" in req)
              .map((req) => (
                <RequestCard key={req._id} request={req} refresh={refresh}/>
              ))}
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 text-foreground-muted my-4">
            {isFetching ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
                <span>Refreshing your requests…</span>
              </>
            ) : (
              <>
                <Inbox className="h-5 w-5" />
                <span>You&apos;re all caught up! No pending requests </span>
              </>
            )}
          </div>
        )}

        <div className="my-2 border-t border-border" />

        <h2 className="text-2xl font-semibold text-foreground py-2 mb-4">
          Completed Requests
        </h2>
        {data &&
        Array.isArray(data.completed_requests) &&
        data.completed_requests.length > 0 ? (
          <div className="space-y-4">
            {data.completed_requests
              .filter((req) => "studentData" in req)
              .map((req) => (
                <RequestCard key={req._id} request={req} refresh={refresh}/>
              ))}
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 text-foreground-muted my-4">
            {isFetching ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
                <span>Refreshing your requests…</span>
              </>
            ) : (
              <>
                <Inbox className="h-5 w-5" />
                <span>You haven&apos;t completed any requests</span>
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
