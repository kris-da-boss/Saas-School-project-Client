import { useAuth } from "../../hooks/useAuth";
import MyChildrenReportCards from "../../features/reportCard/MyChildrenReportCards";
import NotificationBell from "../../components/shared/NotificationBell";

export default function ParentDashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between border-b border-rule pb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-brass">Parent</p>
          <h1 className="font-display text-2xl text-ink">Welcome, {user?.fullName}</h1>
        </div>
        <div className="flex items-center gap-4">
          <NotificationBell />
          <button onClick={logout} className="text-sm underline text-charcoal/70">
            Sign out
          </button>
        </div>
      </div>

      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-brass">Report cards</p>
      <MyChildrenReportCards />
    </div>
  );
}
