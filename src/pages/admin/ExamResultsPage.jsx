import { useParams, Link } from "react-router-dom";
import ExamResultsForm from "../../features/exams/ExamResultsForm";
import { useAuth } from "../../hooks/useAuth";

export default function ExamResultsPage() {
  const { examId } = useParams();
  const { user } = useAuth();
  const basePath = user?.role === "teacher" ? "/teacher" : "/admin";

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mb-6 border-b border-rule pb-4">
        <Link to={`${basePath}/exams`} className="text-xs uppercase tracking-[0.2em] text-brass">
          ← Back to exams
        </Link>
        <h1 className="mt-1 font-display text-2xl text-ink">Enter Results</h1>
      </div>

      <ExamResultsForm examId={examId} />
    </div>
  );
}
