"use client";

import Navbar from "@/components/navbar";
import { FileText, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const DepartmentRepDashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border bg-card shadow-sm">
          <div className="p-6">
            <nav className="space-y-2">
              <Link
                href="/dashboard/deptrep/requests"
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                  isActive("/dashboard/deptrep/requests")
                    ? "bg-accent text-white shadow-md"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <FileText className="w-5 h-5" />
                Requests
              </Link>
              <Link
                href="/dashboard/deptrep/students"
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                  isActive("/dashboard/deptrep/students")
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
        {children}
      </div>
    </div>
  );
};

export default DepartmentRepDashboardLayout;