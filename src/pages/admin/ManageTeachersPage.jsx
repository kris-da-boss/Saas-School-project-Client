import { useState } from "react";
import Button from "../../components/ui/Button";
import TeacherList from "../../features/teachers/TeacherList";
import TeacherForm from "../../features/teachers/TeacherForm";

export default function ManageTeachersPage() {
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSaved = () => {
    setShowForm(false);
    setEditingTeacher(null);
    setRefreshKey((key) => key + 1);
  };

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between border-b border-rule pb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-brass">Admin</p>
          <h1 className="font-display text-2xl text-ink">Teachers</h1>
        </div>
        <Button
          onClick={() => {
            setEditingTeacher(null);
            setShowForm(true);
          }}
        >
          + Add teacher
        </Button>
      </div>

      {showForm && (
        <div className="mb-8">
          <TeacherForm
            editingTeacher={editingTeacher}
            onSaved={handleSaved}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <TeacherList
        refreshKey={refreshKey}
        onEdit={(teacher) => {
          setEditingTeacher(teacher);
          setShowForm(true);
        }}
      />
    </div>
  );
}
