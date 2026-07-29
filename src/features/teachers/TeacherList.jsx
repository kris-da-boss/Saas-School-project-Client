import { useEffect, useState, useCallback } from "react";
import { getTeachers, deactivateTeacher } from "../../api/teacher.api";
import SearchBar from "../../components/shared/SearchBar";
import Pagination from "../../components/shared/Pagination";
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
            <p className="py-6 text-sm text-charcoal/60">No teachers found.</p>
          )}
          {teachers.map((teacher) => (
            <div key={teacher._id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                {teacher.photoUrl ? (
                  <img
                    src={teacher.photoUrl}
                    alt={teacher.fullName}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-rule" />
                )}
                <div>
                  <p className="text-sm font-medium text-ink">{teacher.fullName}</p>
                  <p className="text-xs text-charcoal/60">{teacher.staffId}</p>
                </div>
              </div>
              <div className="flex gap-3 text-xs">
                <button onClick={() => onEdit(teacher)} className="text-brass underline">
                  Edit
                </button>
                <button
                  onClick={() => handleDeactivate(teacher._id)}
                  className="text-red-700 underline"
                >
                  Deactivate
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination page={page} pages={pages} onPageChange={setPage} />
    </div>
  );
}
