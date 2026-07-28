import { useAuth } from "../../hooks/useAuth";

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="p-8">
      <p className="text-xs uppercase tracking-[0.2em] text-brass">Admin</p>
      <h1 className="font-display text-2xl text-ink">Welcome, {user?.fullName}</h1>
      <button onClick={logout} className="mt-6 text-sm underline text-charcoal/70">
        Sign out
      </button>
    </div>
  );
}
