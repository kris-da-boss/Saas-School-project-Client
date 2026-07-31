import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { getClasses, deactivateClass } from "../../api/class.api";
import SearchBar from "../../components/shared/SearchBar";
import Pagination from "../../components/shared/Pagination";
import Button from "../../components/ui/Button";
import { usePagination } from "../../hooks/usePagination";

export default function ClassList({ onEdit, refreshKey }) {
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { page, setPage, limit, pages, setTotal } = usePagination(10);

  const fetchClasses = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getClasses({ page, limit, search });
      setClasses(data.data);
      setTotal(data.pagination.total);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, setTotal]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses, refreshKey]);

  const handleDeactivate = async (id) => {
    if (!confirm("Deactivate this class?")) return;
    setError("");
    try {
      await deactivateClass(id);
      fetchClasses();
    } catch (err) {
      // Surfaces the "reassign students first" guardrail message from the API
      setError(err.response?.data?.message || "Could not deactivate this class");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <SearchBar
        value={search}
        onChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        placeholder="Search by class name"
      />

      {error && <p className="text-sm text-red-700">{error}</p>}

      {loading ? (
        <p className="text-sm text-charcoal/60">Loading...</p>
      ) : (
        <div className="divide-y divide-rule border-y border-rule">
          {classes.length === 0 && (
            <p className="py-8 text-center text-sm text-charcoal/50">
              No classes yet — add your first one above.
            </p>
          )}
          {classes.map((cls) => (
            <div
              key={cls._id}
              className="flex items-center justify-between gap-3 px-2 py-4 transition-colors hover:bg-ink/[0.02]"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">{cls.name}</p>
                <p className="truncate text-xs text-charcoal/50">
                  {cls.studentCount} student{cls.studentCount === 1 ? "" : "s"}
                  {cls.classTeacherId ? ` · ${cls.classTeacherId.fullName}` : ""}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Link
                  to={`/admin/classes/${cls._id}/timetable`}
                  className="rounded-sm border border-rule px-3 py-1.5 text-xs text-charcoal/80 transition-colors hover:border-brass hover:text-brass"
                >
                  Timetable
                </Link>
                <Button size="sm" variant="ghost" onClick={() => onEdit(cls)}>
                  Edit
                </Button>
                <Button size="sm" variant="dangerGhost" onClick={() => handleDeactivate(cls._id)}>
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
