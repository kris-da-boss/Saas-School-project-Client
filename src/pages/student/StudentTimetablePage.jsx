import { useState, useEffect } from "react";
import { getMyTimetable } from "../../api/timetable.api";
import TimetableView from "../../features/timetable/TimetableView";

export default function StudentTimetablePage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await getMyTimetable();
        setEntries(data.data.entries || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mb-6 border-b border-rule pb-4">
        <p className="text-xs uppercase tracking-[0.2em] text-brass">Student</p>
        <h1 className="font-display text-2xl text-ink">My Timetable</h1>
      </div>

      {loading ? (
        <p className="text-sm text-charcoal/60">Loading...</p>
      ) : entries.length === 0 ? (
        <p className="py-8 text-center text-sm text-charcoal/50">
          Nothing scheduled yet — check back once your class's timetable is set.
        </p>
      ) : (
        <TimetableView entries={entries} />
      )}
    </div>
  );
}
