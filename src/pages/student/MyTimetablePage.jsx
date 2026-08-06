import { useState, useEffect } from "react";
import { getMyTimetable } from "../../api/timetable.api";

const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function MyTimetablePage() {
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

  const byDay = DAY_ORDER.map((day) => ({
    day,
    items: entries
      .filter((e) => e.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime)),
  }));

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
          No timetable has been set up for your class yet.
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {byDay.map(({ day, items }) => (
            <div key={day}>
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-brass">{day}</p>
              {items.length === 0 ? (
                <p className="text-sm text-charcoal/40">No lessons</p>
              ) : (
                <div className="divide-y divide-rule border-y border-rule">
                  {items.map((entry) => (
                    <div key={entry._id} className="flex items-center justify-between px-2 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-ink">
                          {entry.subjectId?.name} <span className="text-charcoal/40">({entry.subjectId?.code})</span>
                        </p>
                        <p className="truncate text-xs text-charcoal/50">
                          {entry.teacherId ? entry.teacherId.fullName : "No teacher assigned"}
                        </p>
                      </div>
                      <p className="shrink-0 text-sm text-charcoal/60">
                        {entry.startTime}–{entry.endTime}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
