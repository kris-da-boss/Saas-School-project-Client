import { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { getExams } from "../../api/exam.api";
import SearchBar from "../../components/shared/SearchBar";
import { useAuth } from "../../hooks/useAuth";

export default function ExamList({ refreshKey }) {
  const { user } = useAuth();
  const basePath = user?.role === "teacher" ? "/teacher" : "/admin";

  const [exams, setExams] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchExams = useCallback(async () => {
    setLoading(true);
    try {
      // Fetched unpaginated (up to 200) and grouped client-side below - a
      // school realistically has a small, bounded number of class+term+
      // session combinations per year, so this stays fast without needing
      // the backend to understand "grouped pagination".
      const { data } = await getExams({ limit: 200 });
      setExams(data.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExams();
  }, [fetchExams, refreshKey]);

  // Group individual subject-exams into one row per class+term+session
  const sittings = useMemo(() => {
    const groups = new Map();
    for (const exam of exams) {
      const key = `${exam.classId?._id}-${exam.term}-${exam.session}`;
      if (!groups.has(key)) {
        groups.set(key, {
          key,
          classId: exam.classId?._id,
          className: exam.classId?.name,
          term: exam.term,
          session: exam.session,
          subjectCount: 0,
        });
      }
      groups.get(key).subjectCount += 1;
    }
    return [...groups.values()].filter((s) =>
      search ? s.className?.toLowerCase().includes(search.toLowerCase()) : true
    );
  }, [exams, search]);

  return (
    <div className="flex flex-col gap-4">
      <SearchBar value={search} onChange={setSearch} placeholder="Search by class name" />

      {loading ? (
        <p className="text-sm text-charcoal/60">Loading...</p>
      ) : (
        <div className="divide-y divide-rule border-y border-rule">
          {sittings.length === 0 && (
            <p className="py-8 text-center text-sm text-charcoal/50">
              No exams scheduled yet — add your first one above.
            </p>
          )}
          {sittings.map((sitting) => (
            <Link
              key={sitting.key}
              to={`${basePath}/exams/sitting?classId=${sitting.classId}&term=${encodeURIComponent(
                sitting.term
              )}&session=${encodeURIComponent(sitting.session)}`}
              className="flex items-center justify-between gap-3 px-2 py-4 transition-colors hover:bg-ink/[0.02]"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">{sitting.className}</p>
                <p className="truncate text-xs text-charcoal/50">
                  {sitting.term} · {sitting.session} · {sitting.subjectCount} subject
                  {sitting.subjectCount === 1 ? "" : "s"}
                </p>
              </div>
              <span className="shrink-0 text-xs text-brass">View →</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
