import { useState, useEffect } from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { getClasses } from "../../api/class.api";
import { getMyClasses } from "../../api/teacherClass.api";
import { getSubjects } from "../../api/subject.api";
import { bulkCreateExams } from "../../api/exam.api";
import { useAuth } from "../../hooks/useAuth";

const TERMS = ["First Term", "Second Term", "Third Term"];
const selectClasses =
  "w-full border-b border-rule bg-transparent py-2 text-charcoal outline-none focus:border-brass";

export default function ExamSittingForm({ onSaved, onCancel }) {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);

  const [classId, setClassId] = useState("");
  const [term, setTerm] = useState(TERMS[0]);
  const [session, setSession] = useState("");
  // One row per subject assigned to the selected class: { subjectId, examDate, maxScore }
  const [rows, setRows] = useState([]);

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      const classesRequest = user?.role === "teacher" ? getMyClasses() : getClasses({ limit: 100 });
      const [classesRes, subjectsRes] = await Promise.all([classesRequest, getSubjects({ limit: 100 })]);
      setClasses(classesRes.data.data);
      setAllSubjects(subjectsRes.data.data);
    })();
  }, [user?.role]);

  // Whenever the chosen class changes, rebuild the subject rows from
  // whatever subjects are actually assigned to that class - this is the
  // whole point: nobody re-types the subject list, the system already knows it.
  useEffect(() => {
    if (!classId) {
      setRows([]);
      return;
    }
    const subjectsForClass = allSubjects.filter((s) => s.classIds?.some((c) => c._id === classId));
    setRows(
      subjectsForClass.map((s) => ({
        subjectId: s._id,
        name: s.name,
        code: s.code,
        examDate: "",
        maxScore: 100,
      }))
    );
  }, [classId, allSubjects]);

  const updateRow = (subjectId, field, value) => {
    setRows((prev) => prev.map((r) => (r.subjectId === subjectId ? { ...r, [field]: value } : r)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (rows.length === 0) {
      setError("This class has no subjects assigned yet — add some in Manage Subjects first.");
      return;
    }

    setSubmitting(true);
    try {
      await bulkCreateExams({
        classId,
        term,
        session,
        subjects: rows.map((r) => ({
          subjectId: r.subjectId,
          examDate: r.examDate || undefined,
          maxScore: Number(r.maxScore) || 100,
        })),
      });
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 border border-rule p-6">
      <div>
        <h2 className="font-display text-lg text-ink">Schedule exams</h2>
        <p className="mt-1 text-xs text-charcoal/50">
          Pick a class, term and session once — every subject already assigned to that class will
          appear below.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs uppercase tracking-widest text-charcoal/70">Class</label>
          <select
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            required
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
          <label className="text-xs uppercase tracking-widest text-charcoal/70">Term</label>
          <select value={term} onChange={(e) => setTerm(e.target.value)} className={selectClasses}>
            {TERMS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Session"
          value={session}
          onChange={(e) => setSession(e.target.value)}
          placeholder="e.g. 2026/2027"
          required
        />
      </div>

      {classId && (
        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-brass">
            Subjects for this class ({rows.length})
          </p>

          {rows.length === 0 ? (
            <p className="text-sm text-charcoal/50">
              No subjects are assigned to this class yet — add some in Manage Subjects first.
            </p>
          ) : (
            <div className="flex flex-col divide-y divide-rule border-y border-rule">
              {rows.map((row) => (
                <div
                  key={row.subjectId}
                  className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <p className="text-sm font-medium text-ink sm:w-40 sm:shrink-0">
                    {row.name} <span className="text-charcoal/40">({row.code})</span>
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase tracking-widest text-charcoal/50">
                        Date &amp; time (optional)
                      </label>
                      <input
                        type="datetime-local"
                        value={row.examDate}
                        onChange={(e) => updateRow(row.subjectId, "examDate", e.target.value)}
                        className="border-b border-rule bg-transparent py-1.5 text-sm outline-none focus:border-brass"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase tracking-widest text-charcoal/50">
                        Max score
                      </label>
                      <input
                        type="number"
                        value={row.maxScore}
                        onChange={(e) => updateRow(row.subjectId, "maxScore", e.target.value)}
                        className="w-20 border-b border-rule bg-transparent py-1.5 text-sm outline-none focus:border-brass"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {error && <p className="text-sm text-red-700">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={submitting || rows.length === 0}>
          {submitting ? "Saving..." : `Schedule ${rows.length || ""} exam${rows.length === 1 ? "" : "s"}`}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
