import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function DashboardShell() {
  return (
    <div className="flex min-h-screen bg-parchment">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
