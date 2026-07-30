import { useAuth } from "../../hooks/useAuth";

export default function AdminDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="p-10">
      <p className="text-xs uppercase tracking-[0.2em] text-brass">Overview</p>
      <h1 className="mt-1 font-display text-3xl text-ink">Welcome back, {user?.fullName}</h1>
      <p className="mt-2 max-w-md text-sm text-charcoal/60">
        Use the sidebar to manage students, teachers, and parents. Attendance, results, and fee
        collection will appear here as those features are built.
      </p>
    </div>
  );
}
