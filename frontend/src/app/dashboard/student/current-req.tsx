"use client"
import Progress from "@/components/progress"
import { useQuery } from "@tanstack/react-query"
import { getCurrentUser, getSession } from "@/lib/auth"
import axios from "axios"
import { AlertCircle, CheckCircle2, Clock } from "lucide-react"

interface IFacultyAdvisorApproval {
  approverId: string
  status: "Pending" | "Approved" | "Rejected"
  dueDate?: Date
  rejectionReason?: string
  date?: Date
}

interface IDepartmentApproval {
  department: string
  approverId: string
  status: "Pending" | "Approved" | "Rejected"
  dueDate?: Date
  rejectionReason?: string
  remarks?: string
  date?: Date
}

interface INoDueReq {
  studentRollNumber: string
  facultyAdvisorApproval: IFacultyAdvisorApproval
  departmentApprovals: IDepartmentApproval[]
  status: "Pending" | "FA Approved" | "Fully Approved" | "Rejected"
  createdAt?: Date
  updatedAt?: Date
}

export default function CurrentRequest({
  currentReq,
  rollNumber,
}: {
  currentReq: { active: Array<INoDueReq>; previous: Array<INoDueReq> }
  rollNumber: string
}) {
  const fetchRequests = async () => {
    const session = await getSession()
    const base = (process.env.NEXT_PUBLIC_SERVER_URL || process.env.SERVER_URL) as string
    const resp = await axios.get(`${base}/api/requests/student/${rollNumber}`, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${session}` },
    })
    return resp.data
  }

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["studentRequests"],
    queryFn: fetchRequests,
    initialData: currentReq as unknown,
    refetchOnWindowFocus: true,
  })

  const {
    data: me,
    isLoading: isMeLoading,
    isError: isMeError,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    refetchOnWindowFocus: false,
  })

  if (!currentReq.active || currentReq.active.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Clock className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
        <p className="text-lg font-medium text-foreground">No Active Requests</p>
        <p className="text-sm text-muted-foreground mt-2">You don&apos;t have any requests currently in process.</p>
      </div>
    )
  }

  let progressPercent = 25
  if (data.active[0].facultyAdvisorApproval.status === "Approved") progressPercent += 25

  if (
    data.active[0].departmentApprovals.length > 0 &&
    data.active[0].departmentApprovals.every((approval: IDepartmentApproval) => approval.status === "Approved")
  )
    progressPercent = 100

  const faStatus = currentReq.active[0].facultyAdvisorApproval.status
  const pendingDepartments = currentReq.active[0].departmentApprovals.filter(
    (approval: IDepartmentApproval) => approval.status === "Pending",
  )
  const rejectedDepartments = currentReq.active[0].departmentApprovals.filter(
    (approval: IDepartmentApproval) => approval.status === "Rejected",
  )

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Request Status</h2>
        <p className="text-muted-foreground">Track the progress of your current no-due request</p>
      </div>

      {/* Progress visualization */}
      <div className="bg-card border border-border rounded-lg p-8 mb-8 shadow-sm">
        <Progress progress={progressPercent} />
      </div>

      {/* Status information card */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        {/* Current status section */}
        <div className="mb-6">
          <div className="flex items-start gap-3">
            {faStatus === "Pending" && <Clock className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />}
            {faStatus === "Approved" && pendingDepartments.length === 0 && (
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            )}
            {rejectedDepartments.length > 0 && <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />}

            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">
                {faStatus === "Pending" && "Awaiting Faculty Advisor Review"}
                {faStatus === "Approved" && pendingDepartments.length === 0 && "All Approvals Complete"}
                {faStatus === "Approved" && pendingDepartments.length > 0 && "Awaiting Department Approvals"}
                {faStatus === "Rejected" && "Request Rejected"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {faStatus === "Pending" &&
                  `Waiting for ${me?.facultyAdvisorName || "your faculty advisor"} to review and approve your request.`}
                {faStatus === "Approved" &&
                  pendingDepartments.length === 0 &&
                  `Your request has been approved by all required approvers.`}
                {faStatus === "Approved" &&
                  pendingDepartments.length > 0 &&
                  `Your faculty advisor has approved. Now waiting for department approvals.`}
              </p>
            </div>
          </div>
        </div>

        {/* Pending departments section */}
        {faStatus === "Approved" && pendingDepartments.length > 0 && (
          <div className="border-t border-border pt-6">
            <h4 className="font-medium text-foreground mb-4">Pending Department Approvals</h4>
            <ul className="space-y-3">
              {pendingDepartments.map((dept: IDepartmentApproval) => (
                <li key={dept.department} className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
                  <span className="text-muted-foreground">Waiting for {dept.department} department representative</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Rejected section */}
        {rejectedDepartments.length > 0 && (
          <div className="border-t border-border pt-6">
            <h4 className="font-medium text-red-600 mb-4">Rejection Details</h4>
            <ul className="space-y-3">
              {rejectedDepartments.map((dept: IDepartmentApproval) => (
                <li key={dept.department} className="text-sm">
                  <div className="font-medium text-foreground mb-1">{dept.department}</div>
                  {dept.rejectionReason && <p className="text-muted-foreground">{dept.rejectionReason}</p>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
