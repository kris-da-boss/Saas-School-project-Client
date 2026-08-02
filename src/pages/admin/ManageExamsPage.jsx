import { useState } from "react";
import ExamList from "../../features/exams/ExamList";
import ExamSittingForm from "../../features/exams/ExamSittingForm";
import Button from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";

export default function ManageExamsPage() {
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
          <h1 className="font-display text-2xl text-ink">Exams</h1>
        </div>
        <Button onClick={() => setShowForm(true)}>+ Schedule exams</Button>
      </div>

      {showForm && (
        <div className="mb-8">
          <ExamSittingForm onSaved={handleSaved} onCancel={() => setShowForm(false)} />
        </div>
      )}

      <ExamList refreshKey={refreshKey} />
    </div>
  );
}
