"use server";

import { getSession } from "@/lib/auth";
import { INoDueReq, IStudent } from "@/types/types";
import axios from "axios";

type FetchRequestsParams = {
  page: number;
  limit: number;
  q?: string;
  status?: string;
  department?: string;
};
type itemType = INoDueReq & {_id:string, studentData: IStudent}
type FetchRequestsResponse = {
  ok: boolean;
  data?: {
    items: itemType[];
    total: number;
    totalPages: number;
  };
  error?: string;
};

export async function fetchRequestsAction(
  params: FetchRequestsParams
): Promise<FetchRequestsResponse> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;

    // Build query string
    const queryParams = new URLSearchParams();
    queryParams.set("page", String(params.page));
    queryParams.set("limit", String(params.limit));
    if (params.q) queryParams.set("q", params.q);
    if (params.status) queryParams.set("status", params.status);
    if (params.department) queryParams.set("department", params.department);

    const session = await getSession();
    console.log(session);

    const response = await axios.get(
      `${baseUrl}/api/requests?${queryParams.toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session}`,
        },
      }
    );

    if (response.status !== 200) {
      return {
        ok: false,
        error: `Failed to fetch requests: ${response.statusText}`,
      };
    }

    const data = response.data;
    console.log(data.data);

    return {
      ok: true,
      data: data.data,
    };
  } catch (error) {
    console.error("Error fetching requests:", error);
    if(axios.isAxiosError(error))
      console.log(error.response);

    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function uploadRequestsCsvAction(formData: FormData) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    const session = await getSession();
    const type = formData.get("userType")?.toString();

    const response = await axios.post(
      `${baseUrl}/api/admin/upload/${type}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${session}`,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const result = response.data;
    return {
      ok: true,
      data: result,
    };
  } catch (error) {
    console.error("Error uploading CSV:", error);
    if(axios.isAxiosError(error))
      console.log(error.response?.data);

    throw error;
  }
}
