import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";

export default function DashboardShell({ navItems, roleLabel }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-parchment">
      <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} navItems={navItems} roleLabel={roleLabel} />

      {/* min-w-0 is important here: without it, a flex child containing wide
          content (long names, tables) refuses to shrink below its content's
          natural width, which is what was squeezing the page on mobile. */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile-only top bar with the menu toggle - hidden entirely on
            desktop, where the sidebar is always visible already. */}
        <header className="flex items-center gap-3 border-b border-rule px-4 py-3 md:hidden">
          <button onClick={() => setIsOpen(true)} aria-label="Open menu" className="text-ink">
            <Menu size={22} strokeWidth={1.75} />
          </button>
          <p className="font-display text-lg text-ink">{roleLabel}</p>
        </header>

        <main className="min-w-0 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
