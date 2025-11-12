// app/dashboard/dept-rep/hooks/useDeptRepRequests.ts
"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getSession } from "@/lib/auth";
import axios from "axios";
import { INoDueReq } from "@/types/types";

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


      console.log(data);
      console.log("Data retrieved");
      

      const enrichWithStudentData = async (requests: (INoDueReq & {_id: string})[]) => {
        return Promise.all(
          (requests ?? []).map(async (req) => {
            const roll = req.studentRollNumber;
            if (!roll) return req;
            const s = await axios.get(
              `${sanitizedBase}/api/users/student/${encodeURIComponent(roll)}`
            );
            return { ...req, studentData: s.data };
          })
        );
      };


      console.log("student data");
      
      const returnData = {
        pending_requests: await enrichWithStudentData(data.pending_requests),
        completed_requests: await enrichWithStudentData(data.completed_requests),
      };

      console.log(returnData);
      

      return returnData;
    },
    staleTime: 60_000,
    retry: 1,
  });

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: ["deptRepRequests"] });

  return { ...query, refresh };
};
