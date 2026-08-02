import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { getExams, deactivateExam } from "../../api/exam.api";
import SearchBar from "../../components/shared/SearchBar";
import Pagination from "../../components/shared/Pagination";
import Button from "../../components/ui/Button";
import { usePagination } from "../../hooks/usePagination";
import { useAuth } from "../../hooks/useAuth";

export default function ExamList({ refreshKey }) {
  const { user } = useAuth();
  const basePath = user?.role === "teacher" ? "/teacher" : "/admin";

  const [exams, setExams] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const { page, setPage, limit, pages, setTotal } = usePagination(10);

  const fetchExams = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getExams({ page, limit, search });
      setExams(data.data);
      setTotal(data.pagination.total);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, setTotal]);

  useEffect(() => {
    fetchExams();
  }, [fetchExams, refreshKey]);

  const handleDeactivate = async (id) => {
    if (!confirm("Deactivate this exam?")) return;
    await deactivateExam(id);
    fetchExams();
  };

  return (
    <div className="flex flex-col gap-4">
      <SearchBar
        value={search}
        onChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        placeholder="Search by exam name"
      />

      {loading ? (
        <p className="text-sm text-charcoal/60">Loading...</p>
      ) : (
        <div className="divide-y divide-rule border-y border-rule">
          {exams.length === 0 && (
            <p className="py-8 text-center text-sm text-charcoal/50">
              No exams yet — add your first one above.
            </p>
          )}
          {exams.map((exam) => (
            <div
              key={exam._id}
              className="flex flex-wrap items-center justify-between gap-3 px-2 py-4 transition-colors hover:bg-ink/[0.02]"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">{exam.name}</p>
                <p className="truncate text-xs text-charcoal/50">
                  {exam.classId?.name} · {exam.subjectId?.name} · {exam.term} · {exam.session}
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
                  Deactivate
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination page={page} pages={pages} onPageChange={setPage} />
    </div>
  );
}
