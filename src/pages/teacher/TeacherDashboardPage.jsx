import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getTeacherOverview } from "../../api/dashboard.api";
import StatCard from "../../components/shared/StatCard";
import SectionCard from "../../components/shared/SectionCard";
import { School, GraduationCap, ClipboardCheck, CalendarClock, FileCheck } from "lucide-react";

const actionLinkClasses =
  "flex items-center gap-2 rounded-sm border border-rule px-4 py-2 text-sm text-ink transition-colors hover:border-brass hover:text-brass";

export default function TeacherDashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await getTeacherOverview();
        setData(data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load the overview - try refreshing.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <div className="p-4 sm:p-6 md:p-10 text-sm text-charcoal/60">Loading overview...</div>;
  }
  if (error || !data) {
    return <div className="p-4 sm:p-6 md:p-10 text-sm text-red-700">{error || "No data available."}</div>;
  }

  const {
    classCount,
    studentCount,
    todaysLessons,
    pendingAttendance,
    ungradedCount,
    upcomingExams,
    recentNotifications,
  } = data;

  return (
    <div className="p-4 sm:p-6 md:p-10">
      <p className="text-xs uppercase tracking-[0.2em] text-brass">Overview</p>
      <h1 className="mt-1 font-display text-3xl text-ink">Welcome back, {user?.fullName}</h1>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={School} label="My Classes" value={classCount} />
        <StatCard icon={GraduationCap} label="Students" value={studentCount} />
        <StatCard icon={ClipboardCheck} label="Pending Attendance" value={pendingAttendance.length} accent={pendingAttendance.length > 0} />
        <StatCard icon={FileCheck} label="Ungraded" value={ungradedCount} accent={ungradedCount > 0} />
      </div>

      <div className="mt-8">
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-brass">Quick shortcuts</p>
        <div className="flex flex-wrap gap-3">
          <Link to="/teacher/classes" className={actionLinkClasses}>
            <ClipboardCheck size={15} strokeWidth={1.75} /> Attendance
          </Link>
          <Link to="/teacher/assignments" className={actionLinkClasses}>
            <FileCheck size={15} strokeWidth={1.75} /> Assignments
          </Link>
          <Link to="/teacher/exams" className={actionLinkClasses}>
            <CalendarClock size={15} strokeWidth={1.75} /> Exams
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <SectionCard title="Today's Timetable">
            {todaysLessons.length === 0 ? (
              <p className="text-sm text-charcoal/50">No lessons scheduled for you today.</p>
            ) : (
              <div className="divide-y divide-rule">
                {todaysLessons.map((l, i) => (
                  <div key={i} className="flex items-center justify-between py-2 text-sm">
                    <span className="text-ink">
                      {l.subject} · {l.className}
                    </span>
                    <span className="text-charcoal/50">
                      {l.startTime}–{l.endTime}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard title="Attendance Still Pending Today">
            {pendingAttendance.length === 0 ? (
              <p className="text-sm text-forest">All caught up — every class marked today.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {pendingAttendance.map((c) => (
                  <Link
                    key={c.id}
                    to={`/teacher/classes/${c.id}/attendance`}
                    className="flex items-center justify-between text-sm text-ink hover:text-brass"
                  >
                    <span>{c.name}</span>
                    <span className="text-xs text-brass">Mark now →</span>
                  </Link>
                ))}
              </div>
            )}
          </SectionCard>
        </div>

        <div className="flex flex-col gap-6">
          <SectionCard title="Upcoming Exams">
            {upcomingExams.length === 0 ? (
              <p className="text-sm text-charcoal/50">Nothing scheduled.</p>
            ) : (
              <div className="divide-y divide-rule">
                {upcomingExams.map((e) => (
                  <div key={e._id} className="flex items-center justify-between py-2 text-sm">
                    <span className="text-ink">
                      {e.classId?.name} · {e.subjectId?.name}
                    </span>
                    <span className="text-charcoal/50">
                      {e.examDate
                        ? new Date(e.examDate).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })
                        : "No date set"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard title="Assignments Awaiting Grading">
            {ungradedCount === 0 ? (
              <p className="text-sm text-forest">Nothing waiting on you.</p>
            ) : (
              <div className="flex items-center justify-between text-sm">
                <span className="text-charcoal/70">
                  {ungradedCount} submission{ungradedCount === 1 ? "" : "s"} need grading
                </span>
                <Link to="/teacher/assignments" className="text-xs text-brass">
                  Grade now →
                </Link>
              </div>
            )}
          </SectionCard>

          <SectionCard title="Recent Notifications">
            {recentNotifications.length === 0 ? (
              <p className="text-sm text-charcoal/50">No notifications.</p>
            ) : (
              <div className="flex flex-col divide-y divide-rule">
                {recentNotifications.map((n) => (
                  <div key={n.id} className="flex items-center gap-2 py-2 text-sm">
                    {!n.isRead && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brass" />}
                    <span className="truncate text-charcoal/70">{n.title}</span>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
