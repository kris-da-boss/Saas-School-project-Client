import { useState } from "react";
import SubjectList from "../../features/subjects/SubjectList";
import SubjectForm from "../../features/subjects/SubjectForm";
import Button from "../../components/ui/Button";

export default function ManageSubjectsPage() {
  const [editingSubject, setEditingSubject] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSaved = () => {
    setShowForm(false);
    setEditingSubject(null);
    setRefreshKey((key) => key + 1);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-brass">Admin</p>
          <h1 className="font-display text-2xl text-ink">Subjects</h1>
        </div>
        <Button
          onClick={() => {
            setEditingSubject(null);
            setShowForm(true);
          }}
        >
          + Add subject
        </Button>
      </div>

      {showForm && (
        <div className="mb-8">
          <SubjectForm
            editingSubject={editingSubject}
            onSaved={handleSaved}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <SubjectList
        refreshKey={refreshKey}
        onEdit={(subject) => {
          setEditingSubject(subject);
          setShowForm(true);
        }}
      />
    </div>
  );
}
