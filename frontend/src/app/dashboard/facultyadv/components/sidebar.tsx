import { FileText, Users } from "lucide-react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="w-64 border-r border-border bg-card shadow-sm">
      <div className="p-6">
        <nav className="space-y-2">
          <button
            onClick={() => onTabChange("requests")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all hover:cursor-pointer hover:bg-secondary ${
              activeTab === "requests"
                ? "bg-accent text-white shadow-md "
                : "text-foreground hover:bg-muted"
            }`}
          >
            <FileText className="w-5 h-5" />
            Requests
          </button>
          <button
            onClick={() => onTabChange("students")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all hover:cursor-pointer hover:bg-secondary ${
              activeTab === "students"
                ? "bg-accent text-white shadow-md "
                : "text-foreground hover:bg-muted"
            }`}
          >
            <Users className="w-5 h-5" />
            Students
          </button>
        </nav>
      </div>
    </aside>
  );
}