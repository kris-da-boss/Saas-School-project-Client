import { useState, useEffect } from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { createParent, updateParent } from "../../api/parent.api";

const emptyForm = {
  fullName: "",
  email: "",
  password: "",
  phone: "",
  occupation: "",
  childrenAdmissionNos: "", // comma-separated in the UI, split into an array on submit
};

export default function ParentForm({ editingParent, onSaved, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingParent) {
      setForm({
        fullName: editingParent.fullName || "",
        email: "",
        password: "",
        phone: editingParent.phone || "",
        occupation: editingParent.occupation || "",
        childrenAdmissionNos: (editingParent.childrenIds || [])
          .map((child) => child.admissionNo)
          .join(", "),
      });
    } else {
      setForm(emptyForm);
    }
    setPhoto(null);
  }, [editingParent]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const body = new FormData();
    body.append("fullName", form.fullName);
    if (form.email) body.append("email", form.email);
    if (form.password) body.append("password", form.password);
    if (form.phone) body.append("phone", form.phone);
    if (form.occupation) body.append("occupation", form.occupation);
    if (photo) body.append("photo", photo);

    // Split "MAISON-001, MAISON-002" into separate form-data entries under
    // the same key — that's what the backend expects to build an array from.
    const admissionNos = form.childrenAdmissionNos
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    admissionNos.forEach((no) => body.append("childrenAdmissionNos", no));

    try {
      if (editingParent) {
        await updateParent(editingParent._id, body);
      } else {
        await createParent(body);
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
        {editingParent ? "Edit parent" : "Add parent"}
      </h2>

      <Input label="Full name" name="fullName" value={form.fullName} onChange={handleChange} required />

      {!editingParent && (
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

      <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
      <Input label="Occupation" name="occupation" value={form.occupation} onChange={handleChange} />
      <Input
        label="Children's admission numbers"
        name="childrenAdmissionNos"
        value={form.childrenAdmissionNos}
        onChange={handleChange}
        placeholder="e.g. MAISON-001, MAISON-002"
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-xs uppercase tracking-widest text-charcoal/70">Photo</label>
        <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} />
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save"}
        </Button>
        {editingParent && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
