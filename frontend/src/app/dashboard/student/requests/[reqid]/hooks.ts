"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getSession } from "@/lib/auth";
import axios from "axios";
import { INoDueReq } from "@/types/types";

export const useRequestDetails = (reqid: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["requestDetails"],
    queryFn: async () => {
      const session = await getSession();
      if (!session) throw new Error("No session token");

      const base = process.env.NEXT_PUBLIC_SERVER_URL ?? "";
      const sanitizedBase = base.replace(/\/$/, "");

      const { data } = await axios.get(
        `${sanitizedBase}/api/requests/${reqid}`,
        { headers: { Authorization: `Bearer ${session}` } }
      );

      return data.request as INoDueReq;
    },
    staleTime: 60_000,
    retry: 1,
  });

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: ["requestDetails"] });

  return { ...query, refresh };
};
