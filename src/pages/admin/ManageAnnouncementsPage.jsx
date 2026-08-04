import { useState } from "react";
import AnnouncementList from "../../features/announcements/AnnouncementList";
import AnnouncementForm from "../../features/announcements/AnnouncementForm";
import Button from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";

export default function ManageAnnouncementsPage() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSaved = () => {
    setShowForm(false);
    setRefreshKey((key) => key + 1);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-brass">
            {user?.role === "teacher" ? "Teacher" : "Admin"}
          </p>
          <h1 className="font-display text-2xl text-ink">Announcements</h1>
        </div>
        <Button onClick={() => setShowForm(true)}>+ New announcement</Button>
      </div>

      {showForm && (
        <div className="mb-8">
          <AnnouncementForm onSaved={handleSaved} onCancel={() => setShowForm(false)} />
        </div>
      )}

      <AnnouncementList refreshKey={refreshKey} />
    </div>
  );
}
