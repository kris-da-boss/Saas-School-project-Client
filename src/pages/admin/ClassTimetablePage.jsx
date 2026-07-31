import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { getClassById } from "../../api/class.api";
import { getTimetableForClass, deleteTimetableEntry } from "../../api/timetable.api";
import TimetableView from "../../features/timetable/TimetableView";
import TimetableEntryForm from "../../features/timetable/TimetableEntryForm";
import Button from "../../components/ui/Button";

export default function ClassTimetablePage() {
  const { classId } = useParams();
  const [classInfo, setClassInfo] = useState(null);
  const [timetable, setTimetable] = useState(null);
  const [editingEntry, setEditingEntry] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [classRes, timetableRes] = await Promise.all([
        getClassById(classId),
        getTimetableForClass(classId),
      ]);
      setClassInfo(classRes.data.data);
      setTimetable(timetableRes.data.data);
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSaved = () => {
    setShowForm(false);
    setEditingEntry(null);
    fetchData();
  };

  const handleDelete = async (entryId) => {
    if (!confirm("Remove this lesson from the timetable?")) return;
    await deleteTimetableEntry(classId, entryId);
    fetchData();
  };

  if (loading) return <div className="p-4 sm:p-6 md:p-8 text-sm text-charcoal/60">Loading...</div>;

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-4">
        <div>
          <Link to="/admin/classes" className="text-xs uppercase tracking-[0.2em] text-brass">
            ← Back to classes
          </Link>
          <h1 className="mt-1 font-display text-2xl text-ink">{classInfo?.name} · Timetable</h1>
        </div>
        <Button
          onClick={() => {
            setEditingEntry(null);
            setShowForm(true);
          }}
        >
          + Add lesson
        </Button>
      </div>

      {error && <p className="mb-4 text-sm text-red-700">{error}</p>}

      {showForm && (
        <div className="mb-8">
          <TimetableEntryForm
            classId={classId}
            editingEntry={editingEntry}
            onSaved={handleSaved}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <TimetableView
        entries={timetable?.entries || []}
        onEdit={(entry) => {
          setEditingEntry(entry);
          setShowForm(true);
        }}
        onDelete={handleDelete}
      />
    </div>
  );
}
