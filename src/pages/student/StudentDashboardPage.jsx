import { useAuth } from "../../hooks/useAuth";
import MyAssignments from "../../features/assignments/MyAssignments";
import MyReportCard from "../../features/reportCard/MyReportCard";

export default function StudentDashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between border-b border-rule pb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-brass">Student</p>
          <h1 className="font-display text-2xl text-ink">Welcome, {user?.fullName}</h1>
        </div>
        <button onClick={logout} className="text-sm underline text-charcoal/70">
          Sign out
        </button>
      </div>

      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-brass">My assignments</p>
      <MyAssignments />

      <p className="mb-3 mt-10 text-xs uppercase tracking-[0.2em] text-brass">My report card</p>
      <MyReportCard />
    </div>
  );
}
