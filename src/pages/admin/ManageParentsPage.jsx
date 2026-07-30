import { useState } from "react";
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
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between border-b border-rule pb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-brass">Admin</p>
          <h1 className="font-display text-2xl text-ink">Parents</h1>
        </div>
        <button
          onClick={() => {
            setEditingParent(null);
            setShowForm(true);
          }}
          className="text-sm text-ink underline"
        >
          + Add parent
        </button>
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
