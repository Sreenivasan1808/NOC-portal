import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

const DashboardLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  type User = { role?: string | null };
  const user: User = await getCurrentUser();

  if (user == null) {
    // If not authenticated, send to login. Do NOT perform role-based redirects here;
    // the index page (/dashboard) will handle routing to the appropriate sub-dashboard.
    redirect("/login");
  }

  return <div>{children}</div>;
};

export default DashboardLayout;
