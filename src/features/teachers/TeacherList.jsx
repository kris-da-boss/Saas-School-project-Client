import { useEffect, useState, useCallback } from "react";
import { getTeachers, deactivateTeacher } from "../../api/teacher.api";
import SearchBar from "../../components/shared/SearchBar";
import Pagination from "../../components/shared/Pagination";
import Button from "../../components/ui/Button";
import { usePagination } from "../../hooks/usePagination";

export default function TeacherList({ onEdit, refreshKey }) {
  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const { page, setPage, limit, pages, setTotal } = usePagination(10);

  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getTeachers({ page, limit, search });
      setTeachers(data.data);
      setTotal(data.pagination.total);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, setTotal]);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers, refreshKey]);

  const handleDeactivate = async (id) => {
    if (!confirm("Deactivate this teacher? This suspends their login too.")) return;
    await deactivateTeacher(id);
    fetchTeachers();
  };

  return (
    <div className="flex flex-col gap-4">
      <SearchBar
        value={search}
        onChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        placeholder="Search by name or staff ID"
      />

      {loading ? (
        <p className="text-sm text-charcoal/60">Loading...</p>
      ) : (
        <div className="divide-y divide-rule border-y border-rule">
          {teachers.length === 0 && (
            <p className="py-8 text-center text-sm text-charcoal/50">
              No teachers yet — add your first one above.
            </p>
          )}
          {teachers.map((teacher) => (
            <div
              key={teacher._id}
              className="flex items-center justify-between px-2 py-4 transition-colors hover:bg-ink/[0.02]"
            >
              <div className="flex items-center gap-3">
                {teacher.photoUrl ? (
                  <img
                    src={teacher.photoUrl}
                    alt={teacher.fullName}
                    className="h-11 w-11 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-rule text-sm font-medium text-charcoal/50">
                    {teacher.fullName?.[0]}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-ink">{teacher.fullName}</p>
                  <p className="text-xs text-charcoal/50">{teacher.staffId}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => onEdit(teacher)}>
                  Edit
                </Button>
                <Button size="sm" variant="dangerGhost" onClick={() => handleDeactivate(teacher._id)}>
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
