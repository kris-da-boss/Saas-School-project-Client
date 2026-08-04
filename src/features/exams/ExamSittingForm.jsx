import { useState, useEffect } from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { getClasses } from "../../api/class.api";
import { getMyClasses } from "../../api/teacherClass.api";
import { getSubjects } from "../../api/subject.api";
import { getExams, bulkCreateExams } from "../../api/exam.api";
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
  // One row per subject assigned to the selected class: { subjectId, examDate, maxCA, maxScore }
  const [rows, setRows] = useState([]);
  const [hasExisting, setHasExisting] = useState(false);

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

  const buildBaseRows = (currentClassId, subjectsSource) =>
    subjectsSource
      .filter((s) => s.classIds?.some((c) => c._id === currentClassId))
      .map((s) => ({ subjectId: s._id, name: s.name, code: s.code, examDate: "", maxCA: 40, maxScore: 100 }));

  // The actual fix: when class + term + session are already known (i.e. this
  // sitting was scheduled before), fetch whatever exams already exist and
  // overlay their real values onto the rows - instead of always starting
  // from scratch and forcing a full re-entry to add or adjust one subject.
  const syncWithExisting = async (currentClassId, currentTerm, currentSession) => {
    if (!currentClassId) {
      setRows([]);
      setHasExisting(false);
      return;
    }

    const baseRows = buildBaseRows(currentClassId, allSubjects);

    if (!currentSession) {
      setRows(baseRows);
      setHasExisting(false);
      return;
    }

    try {
      const { data } = await getExams({
        classId: currentClassId,
        term: currentTerm,
        session: currentSession,
        limit: 100,
      });
      const existingBySubject = new Map(data.data.map((exam) => [exam.subjectId._id, exam]));

      setRows(
        baseRows.map((row) => {
          const existing = existingBySubject.get(row.subjectId);
          if (!existing) return row;
          return {
            ...row,
            maxCA: existing.maxCA,
            maxScore: existing.maxScore,
            // datetime-local inputs expect "YYYY-MM-DDTHH:mm" - convert the
            // stored ISO date back into that shape for editing.
            examDate: existing.examDate ? new Date(existing.examDate).toISOString().slice(0, 16) : "",
          };
        })
      );
      setHasExisting(existingBySubject.size > 0);
    } catch {
      // If the lookup fails for any reason, fall back to defaults rather
      // than blocking the admin from scheduling at all.
      setRows(baseRows);
      setHasExisting(false);
    }
  };

  const handleClassChange = (e) => {
    const value = e.target.value;
    setClassId(value);
    syncWithExisting(value, term, session);
  };

  const handleTermChange = (e) => {
    const value = e.target.value;
    setTerm(value);
    syncWithExisting(classId, value, session);
  };

  // Session uses onBlur rather than onChange - re-checking on every
  // keystroke would refetch (and could clobber in-progress row edits)
  // dozens of times while someone is still typing "2026/2027".
  const handleSessionBlur = () => {
    syncWithExisting(classId, term, session);
  };

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
          maxCA: Number(r.maxCA) || 40,
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
          appear below. If this sitting was already scheduled, its existing details load
          automatically so you can add or adjust a subject without re-entering everything.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs uppercase tracking-widest text-charcoal/70">Class</label>
          <select value={classId} onChange={handleClassChange} required className={selectClasses}>
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
          <select value={term} onChange={handleTermChange} className={selectClasses}>
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
          onBlur={handleSessionBlur}
          placeholder="e.g. 2026/2027"
          required
        />
      </div>

      {classId && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.2em] text-brass">
              Subjects for this class ({rows.length})
            </p>
            {hasExisting && (
              <p className="text-xs text-forest">Existing schedule loaded — edit as needed</p>
            )}
          </div>

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
                        Max CA
                      </label>
                      <input
                        type="number"
                        value={row.maxCA}
                        onChange={(e) => updateRow(row.subjectId, "maxCA", e.target.value)}
                        className="w-16 border-b border-rule bg-transparent py-1.5 text-sm outline-none focus:border-brass"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase tracking-widest text-charcoal/50">
                        Max total
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
          {submitting
            ? "Saving..."
            : hasExisting
              ? `Update ${rows.length} exam${rows.length === 1 ? "" : "s"}`
              : `Schedule ${rows.length || ""} exam${rows.length === 1 ? "" : "s"}`}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
