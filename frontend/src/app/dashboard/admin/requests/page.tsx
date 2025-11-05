import { uploadRequestsCsvAction, fetchRequestsAction } from "./actions";

type SearchParams = {
  page?: string;
  limit?: string;
  q?: string;
  status?: string;
  department?: string;
};

export default async function AdminRequestsPage({ searchParams }: { searchParams: SearchParams }) {
  const page = Math.max(1, parseInt(String(searchParams.page ?? '1'), 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(String(searchParams.limit ?? '10'), 10) || 10));
  const q = searchParams.q?.trim() || '';
  const status = searchParams.status || '';
  const department = searchParams.department || '';

  const res = await fetchRequestsAction({ page, limit, q: q || undefined, status: status || undefined, department: department || undefined });
  const items: any[] = res.ok ? res.data.items : [];
  const total = res.ok ? res.data.total : 0;
  const totalPages = res.ok ? res.data.totalPages : 1;

  return (
    <div className="min-h-screen p-8 space-y-8 w-full">
      <h1 className="text-3xl font-bold">Admin - Requests</h1>

      {/* CSV Upload */}
      <div className="shadow p-6 w-full max-w-xl bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Upload Requests CSV</h2>
        <form action={uploadRequestsCsvAction} className="flex flex-col gap-3">
          <input name="file" type="file" accept=".csv" className="border rounded px-3 py-2" />
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-fit" type="submit">Upload</button>
        </form>
        {!res.ok && (
          <p className="text-sm text-red-600 mt-2">Note: requires backend /api/requests/upload and auth</p>
        )}
      </div>

      {/* Filters */}
      <form className="flex flex-col md:flex-row md:items-end md:justify-between gap-4" method="get">
        <div className="flex-1">
          <label className="block text-sm mb-1">Search</label>
          <input name="q" defaultValue={q} type="text" placeholder="Search roll no" className="border rounded px-3 py-2 w-full" />
        </div>
        <div>
          <label className="block text-sm mb-1">Status</label>
          <select name="status" defaultValue={status} className="border rounded px-3 py-2">
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="In Review">In Review</option>
            <option value="Partially Approved">Partially Approved</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Department</label>
          <input name="department" defaultValue={department} type="text" placeholder="e.g. CSE" className="border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm mb-1">Per page</label>
          <select name="limit" defaultValue={String(limit)} className="border rounded px-3 py-2">
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
        <button className="px-4 py-2 bg-gray-800 text-white rounded h-10" type="submit">Apply</button>
      </form>

      {/* Table */}
      <div className="bg-white shadow rounded">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Roll No</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Created</th>
                <th className="px-4 py-2 text-left">Updated</th>
                <th className="px-4 py-2 text-left">Departments</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-center" colSpan={5}>No requests</td>
                </tr>
              )}
              {items.map((it) => (
                <tr className="border-t" key={it._id}>
                  <td className="px-4 py-2">{it.studentRollNumber}</td>
                  <td className="px-4 py-2">{it.status}</td>
                  <td className="px-4 py-2">{it.createdAt ? new Date(it.createdAt).toLocaleString() : '-'}</td>
                  <td className="px-4 py-2">{it.updatedAt ? new Date(it.updatedAt).toLocaleString() : '-'}</td>
                  <td className="px-4 py-2">{Array.isArray(it.departmentApprovals) ? it.departmentApprovals.map((a: any) => `${a.department}:${a.status}`).join(', ') : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
          const params = new URLSearchParams({
            page: String(p),
            limit: String(limit),
            ...(q ? { q } : {}),
            ...(status ? { status } : {}),
            ...(department ? { department } : {}),
          });
          return (
            <a key={p} href={`?${params.toString()}`} className={`px-3 py-1 border rounded ${p === page ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>
              {p}
            </a>
          );
        })}
      </div>
    </div>
  );
}


