import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="p-8">
      <p className="text-xs uppercase tracking-[0.2em] text-brass">Admin</p>
      <h1 className="font-display text-2xl text-ink">Welcome, {user?.fullName}</h1>
      <Link to="/admin/students" className="mt-6 block text-sm underline text-ink">
        Manage students
      </Link>
      <Link to="/admin/teachers" className="mt-2 block text-sm underline text-ink">
        Manage teachers
      </Link>
      <button onClick={logout} className="mt-4 text-sm underline text-charcoal/70">
        Sign out
      </button>
    </div>
  );
}
