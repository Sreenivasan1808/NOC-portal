"use client";
import React from "react";
import Progress from "@/components/progress";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser, getSession } from "@/lib/auth";
import axios from "axios";

interface IFacultyAdvisorApproval {
  approverId: string;
  status: "Pending" | "Approved" | "Rejected";
  dueDate?: Date;
  rejectionReason?: string;
  date?: Date;
}

interface IDepartmentApproval {
  department: string;
  approverId: string;
  status: "Pending" | "Approved" | "Rejected";
  dueDate?: Date;
  rejectionReason?: string;
  remarks?: string;
  date?: Date;
}

interface INoDueReq {
  studentRollNumber: string;
  facultyAdvisorApproval: IFacultyAdvisorApproval;
  departmentApprovals: IDepartmentApproval[];
  status: "Pending" | "FA Approved" | "Fully Approved" | "Rejected";
  createdAt?: Date;
  updatedAt?: Date;
}

export default function CurrentRequest({
  currentReq,
  rollNumber,
}: {
  currentReq: { active: Array<INoDueReq>; previous: Array<INoDueReq> };
  rollNumber: string;
}) {
  // const [step, setStep] = React.useState(1);
  const fetchRequests = async () => {
    const session = await getSession();
    const base = (process.env.NEXT_PUBLIC_SERVER_URL ||
      process.env.SERVER_URL) as string;
    const resp = await axios.get(`${base}/api/requests/student/${rollNumber}`, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${session}` },
    });
    return resp.data;
  };

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["studentRequests"],
    queryFn: fetchRequests,
    initialData: currentReq as unknown,
    // keep data relatively fresh
    refetchOnWindowFocus: true,
  });

  const {
    data: me,
    isLoading: isMeLoading,
    isError: isMeError,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    // avoid frequent refetches for this client-side user data
    refetchOnWindowFocus: false,
  });

  if (!currentReq.active || !currentReq.active.length) {
    return (
      <div className="text-center w-full">
        No requests currently in process.
      </div>
    );
  }

  let progressPercent = 37.5;
  if (data.active[0].facultyAdvisorApproval.status == "Approved")
    progressPercent += 25;

  if (
    data.active[0].departmentApprovals.length > 0 &&
    data.active[0].departmentApprovals.every(
      (approval: IDepartmentApproval) => approval.status === "Approved"
    )
  )
    progressPercent = 100;

  return (
    <div className="p-6 w-full mx-auto flex flex-col items-center">
      <Progress progress={progressPercent} />
      <div className="flex flex-col justify-center">
        <h3 className="text-lg">Current status</h3>
        <p className="text-foreground-muted indent-3">
          {currentReq.active[0].facultyAdvisorApproval.status == "Pending" &&
            `Waiting for ${me.facultyAdvisorName} to approve the request`}
        </p>

        <ol>
          {currentReq.active[0].facultyAdvisorApproval.status == "Approved" &&
            currentReq.active[0].departmentApprovals.map((elmt) => {
              if (elmt.status == "Pending")
                return (
                  <li
                    key={elmt.department}
                  >{`Waiting for representative from ${elmt.department} to approve your request`}</li>
                );
            })}
        </ol>
      </div>
    </div>
  );
}
