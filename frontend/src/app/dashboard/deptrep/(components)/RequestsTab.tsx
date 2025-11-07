"use client";
import RequestCard from "./RequestCard";
import { useDeptRepRequests } from "../(hooks)/useDeptRepRequests";

export default function RequestsTab({ onApprove, onReject }: any) {
  const { data = [], isLoading, isFetching } = useDeptRepRequests();

  if (isLoading) return <div>Loading...</div>;

  return Array.isArray(data) && data.length > 0 ? (
    <div className="space-y-4">
      {data.map((req: any) => (
        <RequestCard key={req._id ?? req.id} request={req} onApprove={onApprove} onReject={onReject} />
      ))}
    </div>
  ) : (
    <div className="flex items-center justify-center text-foreground-muted">
      {isFetching ? "Refreshing..." : "No requests found."}
    </div>
  );
}
