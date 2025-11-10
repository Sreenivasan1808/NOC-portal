"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { getSession } from "@/lib/auth";
import { StudentsView } from "../components/students-view";
import type { Student } from "../types";

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const session = await getSession();
        const base = (process.env.NEXT_PUBLIC_SERVER_URL || process.env.SERVER_URL) as string;
        const resp = await axios.get(`${base}/api/faculty/students`, { withCredentials: true, headers: { Authorization: `Bearer ${session}` } });
        if (!cancelled) setStudents(resp.data?.items ?? []);
      } catch (e: any) {
        if (!cancelled) setError(e?.response?.data?.message || "Failed to load students");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true };
  }, []);

  return (
    <div className="p-8">
      <StudentsView students={students} isLoading={loading} error={error} />
    </div>
  );
}
