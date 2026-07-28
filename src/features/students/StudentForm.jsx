import { useState, useEffect } from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { createStudent, updateStudent } from "../../api/student.api";

const emptyForm = {
  fullName: "",
  email: "",
  password: "",
  admissionNo: "",
  dob: "",
  gender: "",
  address: "",
};

export default function StudentForm({ editingStudent, onSaved, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Repopulate the form when switching between "add" and "edit" a specific student
  useEffect(() => {
    if (editingStudent) {
      setForm({
        fullName: editingStudent.fullName || "",
        email: "",
        password: "",
        admissionNo: editingStudent.admissionNo || "",
        dob: editingStudent.dob ? editingStudent.dob.slice(0, 10) : "",
        gender: editingStudent.gender || "",
        address: editingStudent.address || "",
      });
    } else {
      setForm(emptyForm);
    }
    setPhoto(null);
  }, [editingStudent]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    // FormData, not JSON — this request may contain a binary file
    const body = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) body.append(key, value);
    });
    if (photo) body.append("photo", photo);

    try {
      if (editingStudent) {
        await updateStudent(editingStudent._id, body);
      } else {
        await createStudent(body);
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
        {editingStudent ? "Edit student" : "Add student"}
      </h2>

      <Input label="Full name" name="fullName" value={form.fullName} onChange={handleChange} required />

      {/* Login credentials only apply when creating a brand-new student */}
      {!editingStudent && (
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

      <Input
        label="Admission number"
        name="admissionNo"
        value={form.admissionNo}
        onChange={handleChange}
        required
      />
      <Input label="Date of birth" name="dob" type="date" value={form.dob} onChange={handleChange} />
      <Input
        label="Gender"
        name="gender"
        value={form.gender}
        onChange={handleChange}
        placeholder="male / female"
      />
      <Input label="Address" name="address" value={form.address} onChange={handleChange} />

      <div className="flex flex-col gap-1.5">
        <label className="text-xs uppercase tracking-widest text-charcoal/70">Photo</label>
        <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} />
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save"}
        </Button>
        {editingStudent && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
