import { useState } from "react";
import Button from "../../components/ui/Button";
import ParentList from "../../features/parents/ParentList";
import ParentForm from "../../features/parents/ParentForm";

export default function ManageParentsPage() {
  const [editingParent, setEditingParent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSaved = () => {
    setShowForm(false);
    setEditingParent(null);
    setRefreshKey((key) => key + 1);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-brass">Admin</p>
          <h1 className="font-display text-2xl text-ink">Parents</h1>
        </div>
        <Button
          onClick={() => {
            setEditingParent(null);
            setShowForm(true);
          }}
        >
          + Add parent
        </Button>
      </div>

      {showForm && (
        <div className="mb-8">
          <ParentForm
            editingParent={editingParent}
            onSaved={handleSaved}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <ParentList
        refreshKey={refreshKey}
        onEdit={(parent) => {
          setEditingParent(parent);
          setShowForm(true);
        }}
      />
    </div>
  );
}
