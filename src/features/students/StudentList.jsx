import { useEffect, useState, useCallback } from "react";
import { getStudents, deactivateStudent } from "../../api/student.api";
import SearchBar from "../../components/shared/SearchBar";
import Pagination from "../../components/shared/Pagination";
import Button from "../../components/ui/Button";
import { usePagination } from "../../hooks/usePagination";

export default function StudentList({ onEdit, refreshKey }) {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const { page, setPage, limit, pages, setTotal } = usePagination(10);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getStudents({ page, limit, search });
      setStudents(data.data);
      setTotal(data.pagination.total);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, setTotal]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents, refreshKey]);

  const handleDeactivate = async (id) => {
    if (!confirm("Deactivate this student? This suspends their login too.")) return;
    await deactivateStudent(id);
    fetchStudents();
  };

  return (
    <div className="flex flex-col gap-4">
      <SearchBar
        value={search}
        onChange={(value) => {
          setSearch(value);
          setPage(1); // reset to page 1 on every new search
        }}
        placeholder="Search by name or admission no."
      />

      {loading ? (
        <p className="text-sm text-charcoal/60">Loading...</p>
      ) : (
        <div className="divide-y divide-rule border-y border-rule">
          {students.length === 0 && (
            <p className="py-8 text-center text-sm text-charcoal/50">
              No students yet — add your first one above.
            </p>
          )}
          {students.map((student) => (
            <div
              key={student._id}
              className="flex items-center justify-between px-2 py-4 transition-colors hover:bg-ink/[0.02]"
            >
              <div className="flex items-center gap-3">
                {student.photoUrl ? (
                  <img
                    src={student.photoUrl}
                    alt={student.fullName}
                    className="h-11 w-11 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-rule text-sm font-medium text-charcoal/50">
                    {student.fullName?.[0]}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-ink">{student.fullName}</p>
                  <p className="text-xs text-charcoal/50">{student.admissionNo}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => onEdit(student)}>
                  Edit
                </Button>
                <Button size="sm" variant="dangerGhost" onClick={() => handleDeactivate(student._id)}>
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
