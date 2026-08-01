import { useState } from "react";
import AssignmentList from "../../features/assignments/AssignmentList";
import AssignmentForm from "../../features/assignments/AssignmentForm";
import Button from "../../components/ui/Button";

export default function ManageAssignmentsPage() {
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSaved = () => {
    setShowForm(false);
    setEditingAssignment(null);
    setRefreshKey((key) => key + 1);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-brass">Admin</p>
          <h1 className="font-display text-2xl text-ink">Assignments</h1>
        </div>
        <Button
          onClick={() => {
            setEditingAssignment(null);
            setShowForm(true);
          }}
        >
          + Add assignment
        </Button>
      </div>

      {showForm && (
        <div className="mb-8">
          <AssignmentForm
            editingAssignment={editingAssignment}
            onSaved={handleSaved}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <AssignmentList
        refreshKey={refreshKey}
        onEdit={(assignment) => {
          setEditingAssignment(assignment);
          setShowForm(true);
        }}
      />
    </div>
  );
}
