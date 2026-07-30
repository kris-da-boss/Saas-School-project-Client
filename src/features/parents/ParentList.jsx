import { useEffect, useState, useCallback } from "react";
import { getParents, deactivateParent } from "../../api/parent.api";
import SearchBar from "../../components/shared/SearchBar";
import Pagination from "../../components/shared/Pagination";
import Button from "../../components/ui/Button";
import { usePagination } from "../../hooks/usePagination";

export default function ParentList({ onEdit, refreshKey }) {
  const [parents, setParents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const { page, setPage, limit, pages, setTotal } = usePagination(10);

  const fetchParents = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getParents({ page, limit, search });
      setParents(data.data);
      setTotal(data.pagination.total);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, setTotal]);

  useEffect(() => {
    fetchParents();
  }, [fetchParents, refreshKey]);

  const handleDeactivate = async (id) => {
    if (!confirm("Deactivate this parent? This suspends their login too.")) return;
    await deactivateParent(id);
    fetchParents();
  };

  return (
    <div className="flex flex-col gap-4">
      <SearchBar
        value={search}
        onChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        placeholder="Search by name or phone"
      />

      {loading ? (
        <p className="text-sm text-charcoal/60">Loading...</p>
      ) : (
        <div className="divide-y divide-rule border-y border-rule">
          {parents.length === 0 && (
            <p className="py-8 text-center text-sm text-charcoal/50">
              No parents yet — add your first one above.
            </p>
          )}
          {parents.map((parent) => (
            <div
              key={parent._id}
              className="flex items-center justify-between px-2 py-4 transition-colors hover:bg-ink/[0.02]"
            >
              <div className="flex items-center gap-3">
                {parent.photoUrl ? (
                  <img
                    src={parent.photoUrl}
                    alt={parent.fullName}
                    className="h-11 w-11 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-rule text-sm font-medium text-charcoal/50">
                    {parent.fullName?.[0]}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-ink">{parent.fullName}</p>
                  <p className="text-xs text-charcoal/50">
                    {parent.childrenIds?.length
                      ? parent.childrenIds.map((c) => c.fullName).join(", ")
                      : "No children linked"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => onEdit(parent)}>
                  Edit
                </Button>
                <Button size="sm" variant="dangerGhost" onClick={() => handleDeactivate(parent._id)}>
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
