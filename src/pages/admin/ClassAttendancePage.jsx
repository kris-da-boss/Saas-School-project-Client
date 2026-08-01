import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import AttendanceForm from "../../features/attendance/AttendanceForm";
import AttendanceHistory from "../../features/attendance/AttendanceHistory";

export default function ClassAttendancePage() {
  const { classId } = useParams();
  const [historyKey, setHistoryKey] = useState(0);

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mb-6 border-b border-rule pb-4">
        <Link to="/admin/classes" className="text-xs uppercase tracking-[0.2em] text-brass">
          ← Back to classes
        </Link>
        <h1 className="mt-1 font-display text-2xl text-ink">Attendance</h1>
      </div>

      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-brass">Take attendance</p>
          {/* Bumping historyKey after a save refreshes the history list on
              the right without a full page reload. */}
          <AttendanceForm classId={classId} onSaved={() => setHistoryKey((k) => k + 1)} />
        </div>
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-brass">History</p>
          <AttendanceHistory classId={classId} refreshKey={historyKey} />
        </div>
      </div>
    </div>
  );
}
