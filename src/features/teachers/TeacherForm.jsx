import { useState, useEffect } from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { createTeacher, updateTeacher } from "../../api/teacher.api";

const emptyForm = {
  fullName: "",
  email: "",
  password: "",
  staffId: "",
  qualifications: "",
  phone: "",
};

export default function TeacherForm({ editingTeacher, onSaved, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingTeacher) {
      setForm({
        fullName: editingTeacher.fullName || "",
        email: "",
        password: "",
        staffId: editingTeacher.staffId || "",
        qualifications: editingTeacher.qualifications || "",
        phone: editingTeacher.phone || "",
      });
    } else {
      setForm(emptyForm);
    }
    setPhoto(null);
  }, [editingTeacher]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const body = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) body.append(key, value);
    });
    if (photo) body.append("photo", photo);

    try {
      if (editingTeacher) {
        await updateTeacher(editingTeacher._id, body);
      } else {
        await createTeacher(body);
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
        {editingTeacher ? "Edit teacher" : "Add teacher"}
      </h2>

      <Input label="Full name" name="fullName" value={form.fullName} onChange={handleChange} required />

      {!editingTeacher && (
        <>
          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <Input
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </>
      )}

      <Input label="Staff ID" name="staffId" value={form.staffId} onChange={handleChange} required />
      <Input
        label="Qualifications"
        name="qualifications"
        value={form.qualifications}
        onChange={handleChange}
        placeholder="e.g. B.Ed Mathematics"
      />
      <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />

      <div className="flex flex-col gap-1.5">
        <label className="text-xs uppercase tracking-widest text-charcoal/70">Photo</label>
        <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} />
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save"}
        </Button>
        {editingTeacher && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
