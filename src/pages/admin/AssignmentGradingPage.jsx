import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { getAssignmentById, getAssignmentRoster, gradeSubmission } from "../../api/assignment.api";
import Button from "../../components/ui/Button";

export default function AssignmentGradingPage() {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drafts, setDrafts] = useState({}); // studentId -> { grade, feedback } being edited
  const [savingId, setSavingId] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [assignmentRes, rosterRes] = await Promise.all([
        getAssignmentById(id),
        getAssignmentRoster(id),
      ]);
      setAssignment(assignmentRes.data.data);
      setRoster(rosterRes.data.data);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getDraft = (student) =>
    drafts[student.studentId] || { grade: student.grade ?? "", feedback: student.feedback || "" };

  const updateDraft = (studentId, field, value) => {
    setDrafts((prev) => {
      const existingStudent = roster.find((s) => s.studentId === studentId);
      const current = prev[studentId] || {
        grade: existingStudent?.grade ?? "",
        feedback: existingStudent?.feedback || "",
      };
      return { ...prev, [studentId]: { ...current, [field]: value } };
    });
  };

  const handleSaveGrade = async (studentId) => {
    const draft = drafts[studentId];
    if (!draft) return;
    setSavingId(studentId);
    try {
      await gradeSubmission(id, {
        studentId,
        grade: draft.grade === "" ? null : Number(draft.grade),
        feedback: draft.feedback,
      });
      await fetchData();
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[studentId];
        return next;
      });
    } finally {
      setSavingId(null);
    }
  };

  if (loading) return <div className="p-4 sm:p-6 md:p-8 text-sm text-charcoal/60">Loading...</div>;

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mb-6 border-b border-rule pb-4">
        <Link to="/admin/assignments" className="text-xs uppercase tracking-[0.2em] text-brass">
          ← Back to assignments
        </Link>
        <h1 className="mt-1 font-display text-2xl text-ink">{assignment?.title}</h1>
        <p className="mt-1 text-sm text-charcoal/60">
          {assignment?.classId?.name} · {assignment?.subjectId?.name}
        </p>
      </div>

      <div className="flex flex-col divide-y divide-rule border-y border-rule">
        {roster.map((student) => {
          const draft = getDraft(student);
          const isDirty = !!drafts[student.studentId];
          return (
            <div key={student.studentId} className="flex flex-col gap-3 px-2 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 sm:w-1/3">
                <p className="truncate text-sm font-medium text-ink">{student.fullName}</p>
                <p className="truncate text-xs text-charcoal/50">
                  {student.admissionNo} ·{" "}
                  {student.submitted ? (
                    <span className="text-forest">Submitted</span>
                  ) : (
                    <span className="text-charcoal/40">Not submitted</span>
                  )}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="number"
                  placeholder="Grade"
                  value={draft.grade}
                  onChange={(e) => updateDraft(student.studentId, "grade", e.target.value)}
                  className="w-20 border-b border-rule bg-transparent py-1.5 text-sm outline-none focus:border-brass"
                />
                <input
                  type="text"
                  placeholder="Feedback"
                  value={draft.feedback}
                  onChange={(e) => updateDraft(student.studentId, "feedback", e.target.value)}
                  className="min-w-0 flex-1 border-b border-rule bg-transparent py-1.5 text-sm outline-none focus:border-brass"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={!isDirty || savingId === student.studentId}
                  onClick={() => handleSaveGrade(student.studentId)}
                >
                  {savingId === student.studentId ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
