import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getStudentOverview } from "../../api/dashboard.api";
import StatCard from "../../components/shared/StatCard";
import SectionCard from "../../components/shared/SectionCard";
import Avatar from "../../components/shared/Avatar";
import { ClipboardList, Award, CalendarClock, TrendingUp, CheckCircle2 } from "lucide-react";

const actionLinkClasses =
  "flex items-center gap-2 rounded-sm border border-rule px-4 py-2 text-sm text-ink transition-colors hover:border-brass hover:text-brass";

export default function StudentDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await getStudentOverview();
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

  const { student, attendancePercentage, currentAverage, todaysLessons, upcomingExams, assignmentsDue, latestAnnouncements } =
    data;

  return (
    <div className="p-4 sm:p-6 md:p-10">
      <p className="text-xs uppercase tracking-[0.2em] text-brass">Overview</p>

      {/* Well-framed student photo beside their name - the signature brass
          ring echoes the sidebar's monogram badge elsewhere in the app. */}
      <div className="mt-2 flex items-center gap-4">
        <Avatar src={student.photoUrl} name={student.fullName} size="lg" />
        <div>
          <h1 className="font-display text-2xl text-ink sm:text-3xl">Welcome back, {student.fullName}</h1>
          <p className="text-sm text-charcoal/50">{student.className || "No class assigned yet"}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-2">
        <StatCard
          icon={CheckCircle2}
          label="Attendance"
          value={attendancePercentage !== null ? `${attendancePercentage}%` : "—"}
        />
        <StatCard
          icon={TrendingUp}
          label="Current Average"
          value={currentAverage !== null ? `${currentAverage}%` : "—"}
        />
      </div>

      <div className="mt-8">
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-brass">Quick shortcuts</p>
        <div className="flex flex-wrap gap-3">
          <Link to="/student/assignments" className={actionLinkClasses}>
            <ClipboardList size={15} strokeWidth={1.75} /> My Assignments
          </Link>
          <Link to="/student/report-card" className={actionLinkClasses}>
            <Award size={15} strokeWidth={1.75} /> My Report Card
          </Link>
          <Link to="/student/timetable" className={actionLinkClasses}>
            <CalendarClock size={15} strokeWidth={1.75} /> Timetable
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <SectionCard title="Today's Timetable">
            {todaysLessons.length === 0 ? (
              <p className="text-sm text-charcoal/50">No lessons scheduled for today.</p>
            ) : (
              <div className="divide-y divide-rule">
                {todaysLessons.map((l, i) => (
                  <div key={i} className="flex items-center justify-between py-2 text-sm">
                    <span className="text-ink">{l.subject}</span>
                    <span className="text-charcoal/50">
                      {l.startTime}–{l.endTime}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard title="Assignments Due">
            {assignmentsDue.length === 0 ? (
              <p className="text-sm text-forest">Nothing due — you're all caught up.</p>
            ) : (
              <div className="divide-y divide-rule">
                {assignmentsDue.map((a) => (
                  <div key={a._id} className="flex items-center justify-between py-2 text-sm">
                    <span className="text-ink">
                      {a.title} <span className="text-charcoal/40">({a.subjectId?.name})</span>
                    </span>
                    <span className="text-charcoal/50">
                      {new Date(a.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </span>
                  </div>
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
                    <span className="text-ink">{e.subjectId?.name}</span>
                    <span className="text-charcoal/50">
                      {e.examDate
                        ? new Date(e.examDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })
                        : "No date set"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard title="Latest Announcements">
            {latestAnnouncements.length === 0 ? (
              <p className="text-sm text-charcoal/50">Nothing new.</p>
            ) : (
              <div className="flex flex-col divide-y divide-rule">
                {latestAnnouncements.map((a) => (
                  <div key={a.id} className="flex items-center gap-2 py-2 text-sm">
                    {!a.isRead && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brass" />}
                    <span className="truncate text-charcoal/70">{a.title}</span>
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
