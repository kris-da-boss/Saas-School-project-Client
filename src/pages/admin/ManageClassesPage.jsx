import { useState } from "react";
import ClassList from "../../features/classes/ClassList";
import ClassForm from "../../features/classes/ClassForm";
import Button from "../../components/ui/Button";

export default function ManageClassesPage() {
  const [editingClass, setEditingClass] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSaved = () => {
    setShowForm(false);
    setEditingClass(null);
    setRefreshKey((key) => key + 1);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-brass">Admin</p>
          <h1 className="font-display text-2xl text-ink">Classes</h1>
        </div>
        <Button
          onClick={() => {
            setEditingClass(null);
            setShowForm(true);
          }}
        >
          + Add class
        </Button>
      </div>

      {showForm && (
        <div className="mb-8">
          <ClassForm
            editingClass={editingClass}
            onSaved={handleSaved}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <ClassList
        refreshKey={refreshKey}
        onEdit={(cls) => {
          setEditingClass(cls);
          setShowForm(true);
        }}
      />
    </div>
  );
}
