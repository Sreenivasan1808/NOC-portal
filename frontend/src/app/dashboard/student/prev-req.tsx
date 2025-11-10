"use client"
import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import { getSession } from "@/lib/auth"
import { Check, Hourglass, RefreshCcw, X, ArrowRight } from "lucide-react"
import Link from "next/link"

const statusConfig = {
  Pending: {
    icon: <Hourglass className="w-4 h-4" />,
    badge: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  "FA Approved": {
    icon: <Check className="w-4 h-4" />,
    badge: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
    dot: "bg-amber-600",
  },
  "Fully Approved": {
    icon: <Check className="w-4 h-4" />,
    badge: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  Rejected: {
    icon: <X className="w-4 h-4" />,
    badge: "bg-red-500/15 text-red-700 dark:text-red-400",
    dot: "bg-red-500",
  },
}

export default function PreviousRequests({
  rollNumber,
  initialData,
}: {
  rollNumber: string
  initialData?: unknown
}) {
  const base = (process.env.NEXT_PUBLIC_SERVER_URL || process.env.SERVER_URL) as string

  const fetchRequests = async () => {
    const session = await getSession()
    const resp = await axios.get(`${base}/api/requests/student/${rollNumber}`, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${session}` },
    })
    return resp.data
  }

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["studentRequests", rollNumber],
    queryFn: fetchRequests,
    initialData: initialData as unknown,
    refetchOnWindowFocus: true,
  })

  const sortedRequests = [...data.previous].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Your Previous Requests</h2>
          <p className="text-sm text-foreground-muted mt-1">Track the status of your previously submitted requests</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:cursor-pointer"
          >
            <RefreshCcw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </button>
          {isFetching && <span className="text-xs text-foreground-muted">Syncing…</span>}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-foreground-muted border-t-primary rounded-full animate-spin mx-auto mb-3" />
            <p className="text-foreground-muted">Loading your requests...</p>
          </div>
        </div>
      ) : isError ? (
        <div className="bg-red-500/10 border border-red-200 dark:border-red-900 rounded-lg p-4 text-red-700 dark:text-red-400">
          Failed to load requests. Please try again later.
        </div>
      ) : Array.isArray(sortedRequests) && sortedRequests.length ? (
        <div className="grid gap-3">
          {sortedRequests.map((req: { _id: string; createdAt: Date; status: string }, index: number) => {
            const statusInfo = statusConfig[req.status as keyof typeof statusConfig]
            const formattedDate = new Date(req.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
            const formattedTime = new Date(req.createdAt).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })

            return (
              <div
                key={req._id}
                className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card hover:bg-card/50 transition-colors group"
              >
                {/* Status indicator dot */}
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${statusInfo.dot}`} />

                {/* Request info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="text-sm font-mono text-foreground-muted truncate">Request #{index+1}</p>
                  </div>
                  <p className="text-xs text-foreground-muted">
                    {formattedDate} at {formattedTime}
                  </p>
                </div>

                {/* Status badge */}
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium flex-shrink-0 ${statusInfo.badge}`}
                >
                  {statusInfo.icon}
                  <span>{req.status ?? "Unknown"}</span>
                </div>

                {/* View details link */}
                <Link
                  href={"/dashboard/student/requests/" + encodeURIComponent(req._id)}
                  className="flex items-center gap-1 text-foreground hover:text-accent transition-colors flex-shrink-0"
                >
                  <span className="text-sm font-medium">Details</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-12 h-12 rounded-full bg-foreground-muted/10 flex items-center justify-center mx-auto mb-3">
            <Hourglass className="w-6 h-6 text-foreground-muted" />
          </div>
          <p className="text-foreground-muted">No requests found</p>
          <p className="text-xs text-foreground-muted mt-1">Your submitted requests will appear here</p>
        </div>
      )}
    </div>
  )
}
