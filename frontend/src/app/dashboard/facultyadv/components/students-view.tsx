import { IStudent } from "@/types/types";

interface StudentsViewProps {
  students: (IStudent & {_id : string})[];
  isLoading: boolean;
  error: string | null;
}

export function StudentsView({ students, isLoading, error }: StudentsViewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Students</h2>
        <p className="text-foreground-muted mt-1">View student information</p>
      </div>

      <div className="grid gap-4">
        {isLoading && (
          <div className="text-sm text-foreground-muted">Loading students…</div>
        )}
        {error && <div className="text-sm text-red-600">{error}</div>}
        {!isLoading && !error && students.length === 0 && (
          <div className="text-sm text-foreground-muted">No students found</div>
        )}
        {students.map((student) => (
          <div
            key={student._id ?? student.rollNumber}
            className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {student.name}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-foreground-muted uppercase tracking-wide">
                      Roll Number
                    </p>
                    <p className="text-foreground font-medium">
                      {student.rollNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-foreground-muted uppercase tracking-wide">
                      Department
                    </p>
                    <p className="text-foreground font-medium">
                      {student.department}
                    </p>
                  </div>
                  {student.program && (
                    <div>
                      <p className="text-xs text-foreground-muted uppercase tracking-wide">
                        Program
                      </p>
                      <p className="text-foreground font-medium">
                        {student.program}
                      </p>
                    </div>
                  )}
                  <div className="col-span-2">
                    <p className="text-xs text-foreground-muted uppercase tracking-wide">
                      Email
                    </p>
                    <p className="text-foreground font-medium">{student.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}