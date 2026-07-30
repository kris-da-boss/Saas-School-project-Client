import { useEffect, useState, useCallback } from "react";
import { getParents, deactivateParent } from "../../api/parent.api";
import SearchBar from "../../components/shared/SearchBar";
import Pagination from "../../components/shared/Pagination";
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
            <p className="py-6 text-sm text-charcoal/60">No parents found.</p>
          )}
          {parents.map((parent) => (
            <div key={parent._id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                {parent.photoUrl ? (
                  <img
                    src={parent.photoUrl}
                    alt={parent.fullName}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-rule" />
                )}
                <div>
                  <p className="text-sm font-medium text-ink">{parent.fullName}</p>
                  <p className="text-xs text-charcoal/60">
                    {parent.childrenIds?.length
                      ? parent.childrenIds.map((c) => c.fullName).join(", ")
                      : "No children linked"}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 text-xs">
                <button onClick={() => onEdit(parent)} className="text-brass underline">
                  Edit
                </button>
                <button
                  onClick={() => handleDeactivate(parent._id)}
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
