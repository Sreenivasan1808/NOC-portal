// app/dashboard/dept-rep/hooks/useDeptRepRequests.ts
"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getSession } from "@/lib/auth";
import axios from "axios";

export const useDeptRepRequests = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["deptRepRequests"],
    queryFn: async () => {
      const session = await getSession();
      if (!session) throw new Error("No session token");

      const base = process.env.NEXT_PUBLIC_SERVER_URL ?? "";
      const sanitizedBase = base.replace(/\/$/, "");

      const { data } = await axios.get(
        `${sanitizedBase}/api/requests/deptrep`,
        { headers: { Authorization: `Bearer ${session}` } }
      );

      const enriched = await Promise.all(
        (data.requests ?? []).map(async (req: any) => {
          const roll = req.studentRollNumber ?? req.rollNumber ?? req.student?.roll;
          if (!roll) return req;

          const s = await axios.get(
            `${sanitizedBase}/api/users/student/${encodeURIComponent(roll)}`
          );
          return { ...req, studentData: s.data };
        })
      );

      return enriched;
    },
    staleTime: 60_000,
    retry: 1
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["deptRepRequests"] });

  return { ...query, refresh };
};
