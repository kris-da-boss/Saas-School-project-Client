import { useState, useEffect } from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { createSubject, updateSubject } from "../../api/subject.api";

const emptyForm = { name: "", code: "", classNames: "" };

export default function SubjectForm({ editingSubject, onSaved, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingSubject) {
      setForm({
        name: editingSubject.name || "",
        code: editingSubject.code || "",
        classNames: (editingSubject.classIds || []).map((c) => c.name).join(", "),
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingSubject]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const classNames = form.classNames
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = { name: form.name, code: form.code, classNames };

    try {
      if (editingSubject) {
        await updateSubject(editingSubject._id, payload);
      } else {
        await createSubject(payload);
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
        {editingSubject ? "Edit subject" : "Add subject"}
      </h2>

      <Input label="Subject name" name="name" value={form.name} onChange={handleChange} required />
      <Input
        label="Subject code"
        name="code"
        value={form.code}
        onChange={handleChange}
        placeholder="e.g. MTH"
        required
      />
      <Input
        label="Classes that take this subject"
        name="classNames"
        value={form.classNames}
        onChange={handleChange}
        placeholder="e.g. JSS2A, JSS2B"
      />

      {error && <p className="text-sm text-red-700">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save"}
        </Button>
        {editingSubject && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
