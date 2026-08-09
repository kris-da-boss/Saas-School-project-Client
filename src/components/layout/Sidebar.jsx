import { NavLink } from "react-router-dom";
import { LogOut, BookMarked, X } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

// isOpen/onClose only matter below the md breakpoint - on desktop the
// sidebar is always visible and these props are effectively ignored
// (md:translate-x-0 always wins there).
export default function Sidebar({ isOpen, onClose, navItems, roleLabel }) {
  const { user, logout } = useAuth();

  return (
    <>
      {/* Backdrop - mobile only. Tapping it closes the drawer, same as
          tapping outside any mobile menu. */}
      {isOpen && (
        <div onClick={onClose} className="fixed inset-0 z-30 bg-black/40 md:hidden" aria-hidden="true" />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col justify-between bg-ink text-parchment transition-transform duration-200 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:static md:z-auto md:w-60 md:translate-x-0`}
      >
        <div>
          <div className="flex items-center justify-between px-6 py-8">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-brass text-brass">
                <BookMarked size={16} strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-brass">Registrar's Office</p>
                <p className="font-display text-sm text-parchment/90">{roleLabel}</p>
              </div>
            </div>
            {/* Close button only ever shown on mobile - desktop sidebar
                never needs closing */}
            <button
              onClick={onClose}
              aria-label="Close menu"
              className="text-parchment/60 hover:text-brass md:hidden"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex flex-col gap-1 px-3">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={onClose} // tapping a link also closes the mobile drawer
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
          {/* Temporary build marker for debugging deployment/cache issues -
              change this string with each update so we can confirm from a
              screenshot whether the person is actually running the latest
              deployed code, without needing browser devtools access. */}
          <p className="mt-3 text-[9px] text-parchment/20">build 2026-08-07-02-authfix</p>
        </div>
      </aside>
    </>
  );
}
