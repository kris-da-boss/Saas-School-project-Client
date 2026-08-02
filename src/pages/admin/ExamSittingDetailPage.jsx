import { useEffect, useState, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { getExams, deactivateExam } from "../../api/exam.api";
import Button from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";

export default function ExamSittingDetailPage() {
  const { user } = useAuth();
  const basePath = user?.role === "teacher" ? "/teacher" : "/admin";

  const [searchParams] = useSearchParams();
  const classId = searchParams.get("classId");
  const term = searchParams.get("term");
  const session = searchParams.get("session");

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchExams = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getExams({ classId, term, session, limit: 100 });
      setExams(data.data);
    } finally {
      setLoading(false);
    }
  }, [classId, term, session]);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  const handleDeactivate = async (id) => {
    if (!confirm("Remove this subject from the exam sitting?")) return;
    await deactivateExam(id);
    fetchExams();
  };

  const className = exams[0]?.classId?.name;

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mb-6 border-b border-rule pb-4">
        <Link to={`${basePath}/exams`} className="text-xs uppercase tracking-[0.2em] text-brass">
          ← Back to exams
        </Link>
        <h1 className="mt-1 font-display text-2xl text-ink">
          {className || "Class"} · {term} · {session}
        </h1>
        <p className="mt-1 text-xs text-charcoal/50">
          Adding another subject later? Schedule it again for this same class, term and session —
          existing subjects won't be duplicated.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-charcoal/60">Loading...</p>
      ) : (
        <div className="divide-y divide-rule border-y border-rule">
          {exams.length === 0 && (
            <p className="py-8 text-center text-sm text-charcoal/50">No subjects in this sitting.</p>
          )}
          {exams.map((exam) => (
            <div
              key={exam._id}
              className="flex flex-wrap items-center justify-between gap-3 px-2 py-4 transition-colors hover:bg-ink/[0.02]"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">
                  {exam.subjectId?.name} <span className="text-charcoal/40">({exam.subjectId?.code})</span>
                </p>
                <p className="truncate text-xs text-charcoal/50">
                  Max score: {exam.maxScore}
                  {exam.examDate &&
                    ` · ${new Date(exam.examDate).toLocaleString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}`}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Link
                  to={`${basePath}/exams/${exam._id}/results`}
                  className="rounded-sm border border-rule px-3 py-1.5 text-xs text-charcoal/80 transition-colors hover:border-brass hover:text-brass"
                >
                  Enter results
                </Link>
                <Button size="sm" variant="dangerGhost" onClick={() => handleDeactivate(exam._id)}>
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
