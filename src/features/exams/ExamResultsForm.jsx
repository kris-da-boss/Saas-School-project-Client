import { useState, useEffect, useCallback } from "react";
import { getExamRoster, submitResults } from "../../api/exam.api";
import Button from "../../components/ui/Button";

export default function ExamResultsForm({ examId }) {
  const [exam, setExam] = useState(null);
  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const fetchRoster = useCallback(async () => {
    setLoading(true);
    setSaved(false);
    setError("");
    try {
      const { data } = await getExamRoster(examId);
      setExam(data.data.exam);
      setRoster(
        data.data.roster.map((s) => ({
          ...s,
          caScore: s.caScore ?? "",
          score: s.score ?? "",
        }))
      );
    } catch (err) {
      setError(err.response?.data?.message || "Could not load this exam's roster");
      setRoster([]);
    } finally {
      setLoading(false);
    }
  }, [examId]);

  useEffect(() => {
    fetchRoster();
  }, [fetchRoster]);

  const updateField = (studentId, field, value) => {
    setRoster((prev) => prev.map((s) => (s.studentId === studentId ? { ...s, [field]: value } : s)));
  };

  // Live total/grade preview as the admin types, before saving - purely a
  // display convenience, the real validation happens server-side.
  const maxCA = exam?.maxCA ?? 40;
  const maxExamScore = exam ? exam.maxScore - exam.maxCA : 60;

  const handleSave = async () => {
    setError("");

    // Only submit students who actually have an exam score entered -
    // leaving someone blank means "not graded yet", not "scored zero".
    const records = roster
      .filter((s) => s.score !== "")
      .map((s) => ({
        studentId: s.studentId,
        caScore: s.caScore === "" ? 0 : Number(s.caScore),
        score: Number(s.score),
      }));

    if (records.length === 0) {
      setError("Enter at least one exam score before saving");
      return;
    }

    setSaving(true);
    try {
      await submitResults(examId, { records });
      setSaved(true);
      await fetchRoster();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save results");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-charcoal/60">Loading roster...</p>;
  if (error && roster.length === 0) return <p className="text-sm text-red-700">{error}</p>;

  return (
    <div className="flex flex-col gap-4">
      {exam && (
        <p className="text-sm text-charcoal/60">
          CA: {maxCA} · Exam: {maxExamScore} · Total: {exam.maxScore} · {exam.term} · {exam.session}
        </p>
      )}

      {roster.length === 0 ? (
        <p className="py-8 text-center text-sm text-charcoal/50">No students in this class yet.</p>
      ) : (
        <div className="divide-y divide-rule border-y border-rule">
          {roster.map((student) => {
            const total =
              student.caScore !== "" && student.score !== ""
                ? Number(student.caScore) + Number(student.score)
                : null;
            return (
              <div
                key={student.studentId}
                className="flex flex-col gap-3 px-2 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">{student.fullName}</p>
                  <p className="truncate text-xs text-charcoal/50">
                    {student.admissionNo}
                    {student.grade ? ` · Grade ${student.grade}` : ""}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase tracking-widest text-charcoal/50">
                      CA (of {maxCA})
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={maxCA}
                      placeholder="CA"
                      value={student.caScore}
                      onChange={(e) => updateField(student.studentId, "caScore", e.target.value)}
                      className="w-20 border-b border-rule bg-transparent py-1.5 text-sm outline-none focus:border-brass"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase tracking-widest text-charcoal/50">
                      Exam (of {maxExamScore})
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={maxExamScore}
                      placeholder="Exam"
                      value={student.score}
                      onChange={(e) => updateField(student.studentId, "score", e.target.value)}
                      className="w-20 border-b border-rule bg-transparent py-1.5 text-sm outline-none focus:border-brass"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-widest text-charcoal/50">Total</span>
                    <span className="py-1.5 text-sm text-ink">
                      {total !== null ? `${total}/${exam?.maxScore}` : "—"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {error && roster.length > 0 && <p className="text-sm text-red-700">{error}</p>}
      {saved && <p className="text-sm text-forest">Results saved.</p>}

      {roster.length > 0 && (
        <Button onClick={handleSave} disabled={saving} className="self-start">
          {saving ? "Saving..." : "Save results"}
        </Button>
      )}
    </div>
  );
}
