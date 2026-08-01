import { useState, useEffect, useCallback } from "react";
import { getMyAssignments, submitAssignment } from "../../api/submission.api";
import Button from "../../components/ui/Button";

export default function MyAssignments() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState(null);
  const [error, setError] = useState("");

  const fetchAssignments = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getMyAssignments();
      setItems(data.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const handleFileChange = async (assignmentId, file) => {
    if (!file) return;
    setError("");
    setUploadingId(assignmentId);
    try {
      const body = new FormData();
      body.append("photo", file);
      await submitAssignment(assignmentId, body);
      await fetchAssignments();
    } catch (err) {
      setError(err.response?.data?.message || "Could not submit — try again");
    } finally {
      setUploadingId(null);
    }
  };

  if (loading) return <p className="text-sm text-charcoal/60">Loading assignments...</p>;
  if (items.length === 0) {
    return <p className="text-sm text-charcoal/50">No assignments yet.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {error && <p className="text-sm text-red-700">{error}</p>}
      <div className="divide-y divide-rule border-y border-rule">
        {items.map(({ assignment, submission }) => {
          const overdue = !submission && new Date(assignment.dueDate) < new Date();
          return (
            <div key={assignment._id} className="flex flex-col gap-2 px-2 py-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-ink">{assignment.title}</p>
                  <p className="text-xs text-charcoal/50">
                    {assignment.subjectId?.name} · Due{" "}
                    {new Date(assignment.dueDate).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                    {overdue && <span className="text-red-700"> · Overdue</span>}
                  </p>
                </div>
                {submission ? (
                  <span className="text-xs text-forest">
                    Submitted{submission.grade != null ? ` · Grade: ${submission.grade}` : ""}
                  </span>
                ) : (
                  <label className="cursor-pointer rounded-sm border border-rule px-3 py-1.5 text-xs text-charcoal/80 transition-colors hover:border-brass hover:text-brass">
                    {uploadingId === assignment._id ? "Uploading..." : "Submit photo"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingId === assignment._id}
                      onChange={(e) => handleFileChange(assignment._id, e.target.files[0])}
                    />
                  </label>
                )}
              </div>
              {submission?.feedback && (
                <p className="text-xs text-charcoal/60">Feedback: {submission.feedback}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
