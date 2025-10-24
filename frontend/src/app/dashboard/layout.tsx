import { getRole } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

const DashboardLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const role: string | null = getRole();

  if (!role) {
    redirect("/login");
  }

  switch (role) {
    case "admin":
      redirect("/dashboard/admin");
      break;
    case "student":
      redirect("/dashboard/student");
      break;
    case "facultyadv":
      redirect("/dashboard/facultyadv");
      break;
    case "deptrep":
      redirect("/dashboard/deptrep");
      break;
    default:
      redirect("/unauthorized");
  }
  return <div>{children}</div>;
};

export default DashboardLayout;
