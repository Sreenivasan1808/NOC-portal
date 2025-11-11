"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getSession } from "@/lib/auth";
import type { INoDueReq, IStudent } from "@/types/types";

type ReqType = INoDueReq & { _id: string; studentData: IStudent };

async function fetchAndEnrich(base: string, arr: Array<Record<string, unknown>>) {
  const sanitizedBase = base.replace(/\/$/, "");
  return Promise.all(
    arr.map(async (r) => {
      const record = r as unknown as ReqType;
      try {
        const studentRes = await axios.get(
          `${sanitizedBase}/api/users/student/${record.studentRollNumber}`
        );
        return { ...(record as ReqType), studentData: studentRes.data } as ReqType;
      } catch (err) {
        console.error("Student fetch failed for roll:", record.studentRollNumber, err);
        return record as ReqType;
      }
    })
  );
}

export function useFacultyRequests() {
    const queryClient = useQueryClient();
  const query =  useQuery({
    queryKey: ["facultyRequests"],
    queryFn: async () => {
      const session = await getSession();
      if (!session) throw new Error("No session token");

      const base = process.env.NEXT_PUBLIC_SERVER_URL ?? "";

      const response = await axios.get(`${base.replace(/\/$/, "")}/api/requests/faculty`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session}` },
        withCredentials: true,
      });

      const pending = response.data?.pending_requests ?? [];
      const completed = response.data?.completed_requests ?? [];

      const [pendingEnriched, completedEnriched] = await Promise.all([
        fetchAndEnrich(base, pending),
        fetchAndEnrich(base, completed),
      ]);

      return { pending: pendingEnriched, completed: completedEnriched };
    },
    staleTime: 1000 * 60,
    retry: 1,
  });

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: ["facultyRequests"] });

  return {...query, refresh}

}


