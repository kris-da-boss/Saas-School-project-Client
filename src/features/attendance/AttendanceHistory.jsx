import { useEffect, useState } from "react";
import { getAttendanceDates } from "../../api/attendance.api";

export default function AttendanceHistory({ classId, refreshKey }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await getAttendanceDates(classId);
        setHistory(data.data);
      } finally {
        setLoading(false);
      }
    })();
  }, [classId, refreshKey]);

  if (loading) return <p className="text-sm text-charcoal/60">Loading history...</p>;
  if (history.length === 0) {
    return <p className="text-sm text-charcoal/50">No attendance has been recorded yet.</p>;
  }

  return (
    <div className="divide-y divide-rule border-y border-rule">
      {history.map((entry) => (
        <div key={entry.date} className="flex items-center justify-between px-2 py-3">
          <p className="text-sm text-ink">
            {new Date(entry.date).toLocaleDateString(undefined, {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </p>
          <p className="text-xs text-charcoal/50">
            {entry.presentCount} / {entry.totalCount} present
          </p>
        </div>
      ))}
    </div>
  );
}
