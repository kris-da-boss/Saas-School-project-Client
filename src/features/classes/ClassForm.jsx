import { useState, useEffect } from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { createClass, updateClass } from "../../api/class.api";

const emptyForm = { name: "", classTeacherId: "", capacity: "" };

export default function ClassForm({ editingClass, onSaved, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingClass) {
      setForm({
        name: editingClass.name || "",
        classTeacherId: editingClass.classTeacherId?._id || "",
        capacity: editingClass.capacity || "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingClass]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const payload = {
      name: form.name,
      classTeacherId: form.classTeacherId || null,
      capacity: form.capacity || null,
    };

    try {
      if (editingClass) {
        await updateClass(editingClass._id, payload);
      } else {
        await createClass(payload);
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
      <h2 className="font-display text-lg text-ink">{editingClass ? "Edit class" : "Add class"}</h2>

      <Input label="Class name" name="name" value={form.name} onChange={handleChange} required />
      <Input
        label="Class teacher's ID (optional)"
        name="classTeacherId"
        value={form.classTeacherId}
        onChange={handleChange}
        placeholder="Paste the teacher's account ID from Manage Teachers"
      />
      <Input
        label="Capacity (optional)"
        name="capacity"
        type="number"
        value={form.capacity}
        onChange={handleChange}
      />

      {error && <p className="text-sm text-red-700">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save"}
        </Button>
        {editingClass && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
