import { useState, useEffect } from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { getClasses } from "../../api/class.api";
import { getMyClasses } from "../../api/teacherClass.api";
import { getSubjects } from "../../api/subject.api";
import { createAssignment, updateAssignment } from "../../api/assignment.api";
import { useAuth } from "../../hooks/useAuth";

const emptyForm = { classId: "", subjectId: "", title: "", description: "", dueDate: "" };
const selectClasses =
  "w-full border-b border-rule bg-transparent py-2 text-charcoal outline-none focus:border-brass";

export default function AssignmentForm({ editingAssignment, onSaved, onCancel }) {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      // Teachers only see classes they're actually assigned to - showing
      // the whole school's classes would let them pick one the backend
      // then rejects, which is a confusing dead end.
      const classesRequest =
        user?.role === "teacher" ? getMyClasses() : getClasses({ limit: 100 });
      const [classesRes, subjectsRes] = await Promise.all([classesRequest, getSubjects({ limit: 100 })]);
      setClasses(classesRes.data.data);
      setSubjects(subjectsRes.data.data);
    })();
  }, [user?.role]);

  useEffect(() => {
    if (editingAssignment) {
      setForm({
        classId: editingAssignment.classId?._id || "",
        subjectId: editingAssignment.subjectId?._id || "",
        title: editingAssignment.title || "",
        description: editingAssignment.description || "",
        dueDate: editingAssignment.dueDate ? editingAssignment.dueDate.slice(0, 10) : "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingAssignment]);

  // Only show subjects actually assigned to the selected class
  const relevantSubjects = subjects.filter((s) => s.classIds?.some((c) => c._id === form.classId));

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Changing the class invalidates whatever subject was picked before,
    // since the subject list is filtered per-class.
    if (name === "classId") {
      setForm({ ...form, classId: value, subjectId: "" });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (editingAssignment) {
        await updateAssignment(editingAssignment._id, {
          title: form.title,
          description: form.description,
          dueDate: form.dueDate,
        });
      } else {
        await createAssignment(form);
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
      <h2 className="font-display text-lg text-ink">
        {editingAssignment ? "Edit assignment" : "Add assignment"}
      </h2>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs uppercase tracking-widest text-charcoal/70">Class</label>
        <select
          name="classId"
          value={form.classId}
          onChange={handleChange}
          required
          disabled={!!editingAssignment} // class/subject shouldn't change after creation
          className={selectClasses}
        >
          <option value="">Select a class</option>
          {classes.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs uppercase tracking-widest text-charcoal/70">Subject</label>
        <select
          name="subjectId"
          value={form.subjectId}
          onChange={handleChange}
          required
          disabled={!!editingAssignment || !form.classId}
          className={selectClasses}
        >
          <option value="">{form.classId ? "Select a subject" : "Choose a class first"}</option>
          {relevantSubjects.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name} ({s.code})
            </option>
          ))}
        </select>
      </div>

      <Input label="Title" name="title" value={form.title} onChange={handleChange} required />

      <div className="flex flex-col gap-1.5">
        <label className="text-xs uppercase tracking-widest text-charcoal/70">
          Description (optional)
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          className={selectClasses}
        />
      </div>

      <Input
        label="Due date"
        name="dueDate"
        type="date"
        value={form.dueDate}
        onChange={handleChange}
        required
      />

      {error && <p className="text-sm text-red-700">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save"}
        </Button>
        {editingAssignment && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
