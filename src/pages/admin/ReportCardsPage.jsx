import ReportCardViewer from "../../features/reportCard/ReportCardViewer";
import { useAuth } from "../../hooks/useAuth";

export default function ReportCardsPage() {
  const { user } = useAuth();

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mb-6 border-b border-rule pb-4">
        <p className="text-xs uppercase tracking-[0.2em] text-brass">
          {user?.role === "teacher" ? "Teacher" : "Admin"}
        </p>
        <h1 className="font-display text-2xl text-ink">Report Cards</h1>
      </div>
      <ReportCardViewer />
    </div>
  );
}
