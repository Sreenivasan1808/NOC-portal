import { fetchRequestsAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Users } from "lucide-react";
import { Clock, CheckCircle2, XCircle } from "lucide-react";
import { UploadSection } from "./upload-section";
import Navbar from "@/components/navbar";
import { IDepartmentApproval, INoDueReq, IStudent } from "@/types/types";
import NewUser from "./newUser";

type SearchParams = {
  page?: string;
  limit?: string;
  q?: string;
  status?: string;
  department?: string;
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const page = Math.max(
    1,
    Number.parseInt(String((await searchParams).page ?? "1"), 10) || 1
  );
  const limit = Math.min(
    100,
    Math.max(
      1,
      Number.parseInt(String((await searchParams).limit ?? "10"), 10) || 10
    )
  );
  const q = (await searchParams).q?.trim() || "";
  const status = (await searchParams).status || "";
  const department = (await searchParams).department || "";

  const res = await fetchRequestsAction({
    page,
    limit,
    q: q || undefined,
    status: status || undefined,
    department: department || undefined,
  });

  type itemType = INoDueReq & { _id: string; studentData: IStudent };
  const items: itemType[] = res.data?.items ?? [];
  const total = res.ok ? res.data?.total : 0;
  const totalPages = res.ok ? res.data?.totalPages : 1;

  const getStatusIcon = (status: string | undefined) => {
    const s = (status ?? "").toString().toLowerCase();
    switch (s) {
      case "pending":
        return <Clock className="w-4 h-4 text-amber-500" />;
      case "fa approved":
      case "approved":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-foreground-muted">
            Manage and track student clearance requests across all departments
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-end">
        <NewUser />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Upload Section */}
        <UploadSection />

        {/* Requests Section */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              All Requests
            </h2>
            <p className="text-foreground-muted">
              {total} total request{total !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Search and Filter */}
          <form
            method="get"
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-4"
          >
            <div className="flex-1">
              <label className="block text-sm mb-1">Search</label>
              <div className="relative border border-border rounded-md active:border-primary">
                <Search className="absolute left-3 top-3 w-4 h-4 text-foreground-muted" />
                <Input
                  name="q"
                  defaultValue={q}
                  placeholder="Search roll no or name..."
                  className="pl-10 bg-background border border-border ring-border"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1">Status</label>
              <select
                name="status"
                defaultValue={status}
                className="border rounded px-3 py-2 bg-background border-border"
              >
                <option value="">All</option>
                <option value="Pending">Pending</option>
                <option value="Partially Approved">Partially Approved</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Department</label>
              {/* <div className="border border-border rounded-md">
                <Input
                  name="department"
                  defaultValue={department}
                  placeholder="e.g. CSE"
                  className="bg-background"
                />
              </div> */}
              <select
                name="department"
                defaultValue={String(limit)}
                className="border rounded px-3 py-2 bg-background border-border"
              >
                <option value="CSE">CSE</option>
                <option value="Mech">Mech</option>
                <option value="Civil">Civil</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Per page</label>
              <select
                name="limit"
                defaultValue={String(limit)}
                className="border rounded px-3 py-2 bg-background border-border"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>
            <Button type="submit" className="h-10">
              Apply Filters
            </Button>
          </form>

          {/* Results Table */}
          <div className="bg-white dark:bg-card shadow rounded">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-secondary">
                  <tr>
                    <th className="px-4 py-2 text-left">Roll No</th>
                    <th className="px-4 py-2 text-left">Student Name</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Created</th>
                    <th className="px-4 py-2 text-left">Updated</th>
                    <th className="px-4 py-2 text-left">Departments</th>
                  </tr>
                </thead>
                <tbody>
                  {items?.length === 0 ? (
                    <tr className="border-t dark:border-border bg-background-muted w-full">
                      <td className="px-4 py-6 text-center" colSpan={6}>
                        No requests found
                      </td>
                    </tr>
                  ) : (
                    items?.map((it) => (
                      <tr
                        className="border-t dark:border-border bg-background-muted"
                        key={it._id}
                      >
                        <td className="px-4 py-2">{it.studentRollNumber}</td>
                        <td className="px-4 py-2">{it.studentData.name}</td>
                        <td className="px-4 py-2">{it.status}</td>
                        <td className="px-4 py-2">
                          {it.createdAt
                            ? new Date(it.createdAt).toLocaleString()
                            : "-"}
                        </td>
                        <td className="px-4 py-2">
                          {it.updatedAt
                            ? new Date(it.updatedAt).toLocaleString()
                            : "-"}
                        </td>
                        <td className="px-4 py-2">
                          {Array.isArray(it.departmentApprovals) &&
                          it.departmentApprovals.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {it.departmentApprovals.map(
                                (a: IDepartmentApproval, idx: number) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-1 px-2 py-1 rounded-full text-sm border border-border"
                                  >
                                    {getStatusIcon(a.status)}
                                    <span>{a.department}</span>
                                  </div>
                                )
                              )}
                            </div>
                          ) : (
                            "-"
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2">
            {Array.from({ length: totalPages ?? 1 }, (_, i) => i + 1).map(
              (p) => {
                const params = new URLSearchParams({
                  page: String(p),
                  limit: String(limit),
                  ...(q ? { q } : {}),
                  ...(status ? { status } : {}),
                  ...(department ? { department } : {}),
                });
                return (
                  <a
                    key={p}
                    href={`?${params.toString()}`}
                    className={`px-3 py-1 border rounded ${
                      p === page
                        ? "bg-accent text-white"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    {p}
                  </a>
                );
              }
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
