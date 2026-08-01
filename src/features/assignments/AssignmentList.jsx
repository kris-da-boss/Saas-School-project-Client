import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { getAssignments, deactivateAssignment } from "../../api/assignment.api";
import SearchBar from "../../components/shared/SearchBar";
import Pagination from "../../components/shared/Pagination";
import Button from "../../components/ui/Button";
import { usePagination } from "../../hooks/usePagination";

export default function AssignmentList({ onEdit, refreshKey }) {
  const [assignments, setAssignments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const { page, setPage, limit, pages, setTotal } = usePagination(10);

  const fetchAssignments = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getAssignments({ page, limit, search });
      setAssignments(data.data);
      setTotal(data.pagination.total);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, setTotal]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments, refreshKey]);

  const handleDeactivate = async (id) => {
    if (!confirm("Deactivate this assignment?")) return;
    await deactivateAssignment(id);
    fetchAssignments();
  };

  return (
    <div className="flex flex-col gap-4">
      <SearchBar
        value={search}
        onChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        placeholder="Search by title"
      />

      {loading ? (
        <p className="text-sm text-charcoal/60">Loading...</p>
      ) : (
        <div className="divide-y divide-rule border-y border-rule">
          {assignments.length === 0 && (
            <p className="py-8 text-center text-sm text-charcoal/50">
              No assignments yet — add your first one above.
            </p>
          )}
          {assignments.map((assignment) => (
            <div
              key={assignment._id}
              className="flex flex-wrap items-center justify-between gap-3 px-2 py-4 transition-colors hover:bg-ink/[0.02]"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">{assignment.title}</p>
                <p className="truncate text-xs text-charcoal/50">
                  {assignment.classId?.name} · {assignment.subjectId?.name} · Due{" "}
                  {new Date(assignment.dueDate).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Link
                  to={`/admin/assignments/${assignment._id}/grade`}
                  className="rounded-sm border border-rule px-3 py-1.5 text-xs text-charcoal/80 transition-colors hover:border-brass hover:text-brass"
                >
                  Submissions
                </Link>
                <Button size="sm" variant="ghost" onClick={() => onEdit(assignment)}>
                  Edit
                </Button>
                <Button size="sm" variant="dangerGhost" onClick={() => handleDeactivate(assignment._id)}>
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
