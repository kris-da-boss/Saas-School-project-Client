import { useEffect, useState, useCallback } from "react";
import { getSubjects, deactivateSubject } from "../../api/subject.api";
import SearchBar from "../../components/shared/SearchBar";
import Pagination from "../../components/shared/Pagination";
import Button from "../../components/ui/Button";
import { usePagination } from "../../hooks/usePagination";

export default function SubjectList({ onEdit, refreshKey }) {
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const { page, setPage, limit, pages, setTotal } = usePagination(10);

  const fetchSubjects = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getSubjects({ page, limit, search });
      setSubjects(data.data);
      setTotal(data.pagination.total);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, setTotal]);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects, refreshKey]);

  const handleDeactivate = async (id) => {
    if (!confirm("Deactivate this subject?")) return;
    await deactivateSubject(id);
    fetchSubjects();
  };

  return (
    <div className="flex flex-col gap-4">
      <SearchBar
        value={search}
        onChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        placeholder="Search by name or code"
      />

      {loading ? (
        <p className="text-sm text-charcoal/60">Loading...</p>
      ) : (
        <div className="divide-y divide-rule border-y border-rule">
          {subjects.length === 0 && (
            <p className="py-8 text-center text-sm text-charcoal/50">
              No subjects yet — add your first one above.
            </p>
          )}
          {subjects.map((subject) => (
            <div
              key={subject._id}
              className="flex items-center justify-between gap-3 px-2 py-4 transition-colors hover:bg-ink/[0.02]"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">
                  {subject.name} <span className="text-charcoal/40">· {subject.code}</span>
                </p>
                <p className="truncate text-xs text-charcoal/50">
                  {subject.classIds?.length
                    ? subject.classIds.map((c) => c.name).join(", ")
                    : "Not assigned to any class yet"}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button size="sm" variant="ghost" onClick={() => onEdit(subject)}>
                  Edit
                </Button>
                <Button size="sm" variant="dangerGhost" onClick={() => handleDeactivate(subject._id)}>
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
