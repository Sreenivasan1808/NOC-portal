import { redirect } from "next/navigation";

export default function Page() {
  // redirect to requests subpage by default
  redirect("/dashboard/facultyadv/requests");
}
