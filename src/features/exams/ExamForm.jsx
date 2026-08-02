import { useState, useEffect } from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { getClasses } from "../../api/class.api";
import { getMyClasses } from "../../api/teacherClass.api";
import { getSubjects } from "../../api/subject.api";
import { createExam } from "../../api/exam.api";
import { useAuth } from "../../hooks/useAuth";

const TERMS = ["First Term", "Second Term", "Third Term"];
const emptyForm = {
  name: "",
  term: TERMS[0],
  session: "",
  classId: "",
  subjectId: "",
  maxScore: 100,
  examDate: "",
};
const selectClasses =
  "w-full border-b border-rule bg-transparent py-2 text-charcoal outline-none focus:border-brass";

export default function ExamForm({ onSaved, onCancel }) {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      const classesRequest =
        user?.role === "teacher" ? getMyClasses() : getClasses({ limit: 100 });
      const [classesRes, subjectsRes] = await Promise.all([classesRequest, getSubjects({ limit: 100 })]);
      setClasses(classesRes.data.data);
      setSubjects(subjectsRes.data.data);
    })();
  }, [user?.role]);

  const relevantSubjects = subjects.filter((s) => s.classIds?.some((c) => c._id === form.classId));

  const handleChange = (e) => {
    const { name, value } = e.target;
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
      await createExam({ ...form, maxScore: Number(form.maxScore) || 100 });
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 border border-rule p-6">
      <h2 className="font-display text-lg text-ink">Add exam</h2>

      <Input
        label="Exam name"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="e.g. First Term Examination"
        required
      />

      <div className="flex gap-4">
        <div className="flex flex-1 flex-col gap-1.5">
          <label className="text-xs uppercase tracking-widest text-charcoal/70">Term</label>
          <select name="term" value={form.term} onChange={handleChange} className={selectClasses}>
            {TERMS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <Input
          label="Session"
          name="session"
          value={form.session}
          onChange={handleChange}
          placeholder="e.g. 2025/2026"
          required
          className="flex-1"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs uppercase tracking-widest text-charcoal/70">Class</label>
        <select name="classId" value={form.classId} onChange={handleChange} required className={selectClasses}>
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
          disabled={!form.classId}
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

      <Input
        label="Max score"
        name="maxScore"
        type="number"
        value={form.maxScore}
        onChange={handleChange}
      />
      <Input label="Exam date (optional)" name="examDate" type="date" value={form.examDate} onChange={handleChange} />

      {error && <p className="text-sm text-red-700">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
