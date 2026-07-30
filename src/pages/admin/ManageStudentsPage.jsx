import { useState } from "react";
import Button from "../../components/ui/Button";
import StudentList from "../../features/students/StudentList";
import StudentForm from "../../features/students/StudentForm";

export default function ManageStudentsPage() {
  const [editingStudent, setEditingStudent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSaved = () => {
    setShowForm(false);
    setEditingStudent(null);
    setRefreshKey((key) => key + 1); // forces StudentList to refetch
  };

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between border-b border-rule pb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-brass">Admin</p>
          <h1 className="font-display text-2xl text-ink">Students</h1>
        </div>
        <Button
          onClick={() => {
            setEditingStudent(null);
            setShowForm(true);
          }}
        >
          + Add student
        </Button>
      </div>

      {showForm && (
        <div className="mb-8">
          <StudentForm
            editingStudent={editingStudent}
            onSaved={handleSaved}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <StudentList
        refreshKey={refreshKey}
        onEdit={(student) => {
          setEditingStudent(student);
          setShowForm(true);
        }}
      />
    </div>
  );
}
