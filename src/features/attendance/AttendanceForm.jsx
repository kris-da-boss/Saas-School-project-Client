import { useState, useEffect, useCallback } from "react";
import { getAttendanceForDate, markAttendance } from "../../api/attendance.api";
import Button from "../../components/ui/Button";

const STATUSES = ["present", "absent", "late", "excused"];
const STATUS_STYLES = {
  present: "bg-forest text-parchment border-forest",
  absent: "bg-red-700 text-parchment border-red-700",
  late: "bg-brass text-parchment border-brass",
  excused: "bg-charcoal/60 text-parchment border-charcoal/60",
};
const TERMS = ["First Term", "Second Term", "Third Term"];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function AttendanceForm({ classId, onSaved }) {
  const [date, setDate] = useState(todayISO());
  // Tagging attendance with term/session is what lets a report card later
  // compute a real attendance summary. Not required, but strongly
  // recommended - see the note below the roster.
  const [term, setTerm] = useState(TERMS[0]);
  const [session, setSession] = useState("");
  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const fetchRoster = useCallback(async () => {
    setLoading(true);
    setSaved(false);
    setError("");
    try {
      const { data } = await getAttendanceForDate(classId, date);
      // Unmarked students default to "present" here in the UI only - the
      // backend keeps status as null until explicitly submitted, so nothing
      // is recorded as attendance until the admin actually hits Save.
      setRoster(data.data.roster.map((s) => ({ ...s, status: s.status || "present" })));
      // If this date was already marked with a term/session, reflect that.
      // Otherwise, leave the current selection alone - re-picking the term
      // for every single day would be tedious busywork.
      if (data.data.term) setTerm(data.data.term);
      if (data.data.session) setSession(data.data.session);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load this class's roster");
      setRoster([]);
    } finally {
      setLoading(false);
    }
  }, [classId, date]);

  useEffect(() => {
    fetchRoster();
  }, [fetchRoster]);

  const setStatus = (studentId, status) => {
    setRoster((prev) => prev.map((s) => (s.studentId === studentId ? { ...s, status } : s)));
  };

  const handleSave = async () => {
    setError("");
    setSaving(true);
    try {
      await markAttendance(classId, {
        date,
        term,
        session,
        records: roster.map((s) => ({ studentId: s.studentId, status: s.status })),
      });
      setSaved(true);
      onSaved?.();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save attendance");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs uppercase tracking-widest text-charcoal/70">Date</label>
          <input
            type="date"
            value={date}
            max={todayISO()}
            onChange={(e) => setDate(e.target.value)}
            className="border-b border-rule bg-transparent py-2 text-charcoal outline-none focus:border-brass"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs uppercase tracking-widest text-charcoal/70">Term</label>
          <select
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="border-b border-rule bg-transparent py-2 text-charcoal outline-none focus:border-brass"
          >
            {TERMS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs uppercase tracking-widest text-charcoal/70">Session</label>
          <input
            type="text"
            value={session}
            onChange={(e) => setSession(e.target.value)}
            placeholder="e.g. 2026/2027"
            className="border-b border-rule bg-transparent py-2 text-charcoal outline-none focus:border-brass"
          />
        </div>
      </div>
      <p className="text-xs text-charcoal/40">
        Term and session let this attendance count toward that period's report cards.
      </p>

      {loading ? (
        <p className="text-sm text-charcoal/60">Loading roster...</p>
      ) : error && roster.length === 0 ? (
        <p className="py-8 text-center text-sm text-red-700">{error}</p>
      ) : roster.length === 0 ? (
        <p className="py-8 text-center text-sm text-charcoal/50">No students in this class yet.</p>
      ) : (
        <div className="divide-y divide-rule border-y border-rule">
          {roster.map((student) => (
            <div
              key={student.studentId}
              className="flex flex-wrap items-center justify-between gap-3 px-2 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">{student.fullName}</p>
                <p className="truncate text-xs text-charcoal/50">{student.admissionNo}</p>
              </div>
              <div className="flex shrink-0 gap-1.5">
                {STATUSES.map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatus(student.studentId, status)}
                    className={`rounded-sm border px-2.5 py-1 text-xs capitalize transition-colors ${
                      student.status === status
                        ? STATUS_STYLES[status]
                        : "border-rule text-charcoal/50 hover:border-charcoal/40"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {error && roster.length > 0 && <p className="text-sm text-red-700">{error}</p>}
      {saved && <p className="text-sm text-forest">Attendance saved for {date}.</p>}

      {roster.length > 0 && (
        <Button onClick={handleSave} disabled={saving} className="self-start">
          {saving ? "Saving..." : "Save attendance"}
        </Button>
      )}
    </div>
  );
}
