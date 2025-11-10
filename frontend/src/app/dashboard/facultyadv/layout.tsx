"use client";

import Navbar from "@/components/navbar";
import { FileText, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function FacultyAdvLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() || "";

  const isActive = (p: string) =>
    pathname.startsWith(`/dashboard/facultyadv/${p}`) ||
    (p === "requests" && pathname === "/dashboard/facultyadv");

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <div className="flex flex-1">
        <aside className="w-64 border-r border-border bg-card shadow-sm">
          <div className="p-6">
            <nav className="space-y-2">
              <Link
                href="/dashboard/facultyadv/requests"
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all hover:cursor-pointer hover:bg-secondary ${
                  isActive("requests")
                    ? "bg-accent text-white shadow-md"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <FileText className="w-5 h-5" />
                Requests
              </Link>
              <Link
                href="/dashboard/facultyadv/students"
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all hover:cursor-pointer hover:bg-secondary ${
                  isActive("students")
                    ? "bg-accent text-white shadow-md"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <Users className="w-5 h-5" />
                Students
              </Link>
            </nav>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
