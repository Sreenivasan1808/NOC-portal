"use server";

import axios from "axios";
import { cookies } from "next/headers";

export async function uploadRequestsCsvAction(formData: FormData) {
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { ok: false, error: "CSV file is required" };
  }

  const session = (await cookies()).get("session")?.value;
  if (!session) return { ok: false, error: "Unauthorized" };

  try {
    const data = new FormData();
    data.append("file", file);

    const res = await fetch(`${process.env.SERVER_URL}/api/requests/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${session}` },
      body: data,
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { ok: false, error: body?.message ?? "Upload failed" };
    }

    const json = await res.json();
    return { ok: true, data: json };
  } catch (e) {
    return { ok: false, error: "Network error" };
  }
}

export type ListParams = {
  page?: number;
  limit?: number;
  q?: string;
  status?: string;
  department?: string;
};

export async function fetchRequestsAction(params: ListParams) {
  const session = (await cookies()).get("session")?.value;
  if (!session) return { ok: false, error: "Unauthorized" };

  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.q) query.set("q", params.q);
  if (params.status) query.set("status", params.status);
  if (params.department) query.set("department", params.department);

  try {
    const res = await fetch(`${process.env.SERVER_URL}/api/requests?${query.toString()}`, {
      headers: { Authorization: `Bearer ${session}` },
      cache: "no-store",
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { ok: false, error: body?.message ?? "Failed to load" };
    }
    const json = await res.json();
    return { ok: true, data: json };
  } catch (e) {
    return { ok: false, error: "Network error" };
  }
}


