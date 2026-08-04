import { useState, useEffect } from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { createAnnouncement } from "../../api/announcement.api";
import { getClasses } from "../../api/class.api";
import { getMyClasses } from "../../api/teacherClass.api";
import { useAuth } from "../../hooks/useAuth";

const ADMIN_AUDIENCE = ["admin", "teacher", "student", "parent"];
const TEACHER_AUDIENCE = ["student", "parent"];

export default function AnnouncementForm({ onSaved, onCancel }) {
  const { user } = useAuth();
  const isTeacher = user?.role === "teacher";
  const availableAudience = isTeacher ? TEACHER_AUDIENCE : ADMIN_AUDIENCE;

  const [classes, setClasses] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState([]);
  const [classId, setClassId] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = isTeacher ? await getMyClasses() : await getClasses({ limit: 100 });
      setClasses(data.data);
    })();
  }, [isTeacher]);

  const toggleAudience = (role) => {
    setAudience((prev) => (prev.includes(role) ? prev.filter((a) => a !== role) : [...prev, role]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (audience.length === 0) {
      setError("Choose at least one audience");
      return;
    }
    if (isTeacher && !classId) {
      setError("Choose which of your classes this is for");
      return;
    }

    setSubmitting(true);
    try {
      await createAnnouncement({ title, body, audience, classId: classId || null });
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 border border-rule p-6">
      <h2 className="font-display text-lg text-ink">New announcement</h2>

      <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />

      <div className="flex flex-col gap-1.5">
        <label className="text-xs uppercase tracking-widest text-charcoal/70">Message</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          required
          className="w-full border-b border-rule bg-transparent py-2 text-charcoal outline-none focus:border-brass"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs uppercase tracking-widest text-charcoal/70">Audience</label>
        <div className="flex flex-wrap gap-3">
          {availableAudience.map((role) => (
            <label key={role} className="flex items-center gap-1.5 text-sm capitalize text-charcoal/80">
              <input
                type="checkbox"
                checked={audience.includes(role)}
                onChange={() => toggleAudience(role)}
              />
              {role}s
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs uppercase tracking-widest text-charcoal/70">
          {isTeacher ? "Class (required)" : "Class (optional - leave blank for school-wide)"}
        </label>
        <select
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
          required={isTeacher}
          className="w-full border-b border-rule bg-transparent py-2 text-charcoal outline-none focus:border-brass"
        >
          <option value="">{isTeacher ? "Select a class" : "All classes (school-wide)"}</option>
          {classes.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Posting..." : "Post announcement"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
