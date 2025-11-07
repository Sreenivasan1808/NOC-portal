"use client";

export default function StudentsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">
          Students
        </h2>
        <p className="text-foreground-muted mt-1">
          View student information
        </p>
      </div>

      <div className="grid gap-4">
        {/* Placeholder since real student list is not implemented yet */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-foreground mb-2">
                Student List Coming Soon
              </h3>
              <p className="text-foreground-muted">
                Integrate department-wise student listing here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
