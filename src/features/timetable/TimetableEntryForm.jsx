import { useState, useEffect } from "react";
import Button from "../../components/ui/Button";
import { getSubjects } from "../../api/subject.api";
import { getTeachers } from "../../api/teacher.api";
import { addTimetableEntry, updateTimetableEntry } from "../../api/timetable.api";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const emptyForm = { day: "Monday", startTime: "", endTime: "", subjectId: "", teacherId: "" };

const selectClasses =
  "border-b border-rule bg-transparent py-2 text-charcoal outline-none focus:border-brass";

export default function TimetableEntryForm({ classId, editingEntry, onSaved, onCancel }) {
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch the pickable options once. Subjects are filtered down to only
  // those actually assigned to THIS class (via Subject.classIds) - showing
  // every subject in the school would let an admin schedule something this
  // class was never set up to take.
  useEffect(() => {
    (async () => {
      const [subjectsRes, teachersRes] = await Promise.all([
        getSubjects({ limit: 100 }),
        getTeachers({ limit: 100 }),
      ]);
      const relevantSubjects = subjectsRes.data.data.filter((s) =>
        s.classIds?.some((c) => c._id === classId)
      );
      setSubjects(relevantSubjects);
      setTeachers(teachersRes.data.data);
    })();
  }, [classId]);

  useEffect(() => {
    if (editingEntry) {
      setForm({
        day: editingEntry.day,
        startTime: editingEntry.startTime,
        endTime: editingEntry.endTime,
        subjectId: editingEntry.subjectId?._id || "",
        teacherId: editingEntry.teacherId?._id || "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingEntry]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    // teacherId sent as "" is meaningful on edit (explicit unassign) - the
    // backend distinguishes that from the field being absent entirely.
    const payload = { ...form };

    try {
      if (editingEntry) {
        await updateTimetableEntry(classId, editingEntry._id, payload);
      } else {
        await addTimetableEntry(classId, payload);
      }
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 border border-rule p-6">
      <h2 className="font-display text-lg text-ink">{editingEntry ? "Edit lesson" : "Add lesson"}</h2>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs uppercase tracking-widest text-charcoal/70">Day</label>
        <select name="day" value={form.day} onChange={handleChange} className={selectClasses}>
          {DAYS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-4">
        <div className="flex flex-1 flex-col gap-1.5">
          <label className="text-xs uppercase tracking-widest text-charcoal/70">Start time</label>
          <input
            type="time"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            required
            className={selectClasses}
          />
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <label className="text-xs uppercase tracking-widest text-charcoal/70">End time</label>
          <input
            type="time"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
            required
            className={selectClasses}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs uppercase tracking-widest text-charcoal/70">Subject</label>
        <select name="subjectId" value={form.subjectId} onChange={handleChange} required className={selectClasses}>
          <option value="">Select a subject</option>
          {subjects.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name} ({s.code})
            </option>
          ))}
        </select>
        {subjects.length === 0 && (
          <p className="text-xs text-charcoal/50">
            No subjects are assigned to this class yet — add some in Manage Subjects first.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs uppercase tracking-widest text-charcoal/70">Teacher (optional)</label>
        <select name="teacherId" value={form.teacherId} onChange={handleChange} className={selectClasses}>
          <option value="">No teacher assigned</option>
          {teachers.map((t) => (
            <option key={t._id} value={t._id}>
              {t.fullName}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save"}
        </Button>
        {editingEntry && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
