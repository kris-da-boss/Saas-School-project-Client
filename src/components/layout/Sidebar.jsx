import { NavLink } from "react-router-dom";
import { LayoutGrid, GraduationCap, Presentation, Users, LogOut, BookMarked } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const navItems = [
  { to: "/admin", label: "Overview", icon: LayoutGrid, end: true },
  { to: "/admin/students", label: "Students", icon: GraduationCap },
  { to: "/admin/teachers", label: "Teachers", icon: Presentation },
  { to: "/admin/parents", label: "Parents", icon: Users },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="flex w-60 shrink-0 flex-col justify-between bg-ink text-parchment">
      <div>
        {/* Signature mark - a brass-ringed monogram, echoes the login page's
            "Registrar's Office" branding */}
        <div className="flex items-center gap-3 px-6 py-8">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-brass text-brass">
            <BookMarked size={16} strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-brass">Registrar's Office</p>
            <p className="font-display text-sm text-parchment/90">Admin</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1 px-3">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-sm border-l-2 px-3 py-2.5 text-sm transition-colors ${
                  isActive
                    ? "border-brass bg-parchment/10 text-parchment"
                    : "border-transparent text-parchment/60 hover:bg-parchment/5 hover:text-parchment"
                }`
              }
            >
              <Icon size={16} strokeWidth={1.75} />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="border-t border-parchment/10 px-6 py-5">
        <p className="truncate text-sm text-parchment/80">{user?.fullName}</p>
        <button
          onClick={logout}
          className="mt-2 flex items-center gap-2 text-xs uppercase tracking-widest text-parchment/50 transition-colors hover:text-brass"
        >
          <LogOut size={14} strokeWidth={1.75} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
