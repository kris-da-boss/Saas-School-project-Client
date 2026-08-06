import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAdminOverview } from "../../api/dashboard.api";
import StatCard from "../../components/shared/StatCard";
import SectionCard from "../../components/shared/SectionCard";
import {
  GraduationCap,
  Presentation,
  Users,
  School,
  BookOpen,
  UserPlus,
  Megaphone,
  FileCheck,
} from "lucide-react";

const actionLinkClasses =
  "flex items-center gap-2 rounded-sm border border-rule px-4 py-2 text-sm text-ink transition-colors hover:border-brass hover:text-brass";

function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await getAdminOverview();
        setData(data.data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading || !data) {
    return <div className="p-4 sm:p-6 md:p-10 text-sm text-charcoal/60">Loading overview...</div>;
  }

  const { counts, todaysAttendance, upcomingExams, activity, recentNotifications } = data;

  return (
    <div className="p-4 sm:p-6 md:p-10">
      <p className="text-xs uppercase tracking-[0.2em] text-brass">Overview</p>
      <h1 className="mt-1 font-display text-3xl text-ink">Welcome back</h1>

      {/* Summary cards */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard icon={GraduationCap} label="Students" value={counts.studentCount} />
        <StatCard icon={Presentation} label="Teachers" value={counts.teacherCount} />
        <StatCard icon={Users} label="Parents" value={counts.parentCount} />
        <StatCard icon={School} label="Classes" value={counts.classCount} />
        <StatCard icon={BookOpen} label="Subjects" value={counts.subjectCount} />
      </div>

      {/* Quick actions */}
      <div className="mt-8">
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-brass">Quick actions</p>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/students" className={actionLinkClasses}>
            <UserPlus size={15} strokeWidth={1.75} /> Add Student
          </Link>
          <Link to="/admin/teachers" className={actionLinkClasses}>
            <UserPlus size={15} strokeWidth={1.75} /> Add Teacher
          </Link>
          <Link to="/admin/announcements" className={actionLinkClasses}>
            <Megaphone size={15} strokeWidth={1.75} /> New Announcement
          </Link>
          <Link to="/admin/exams" className={actionLinkClasses}>
            <FileCheck size={15} strokeWidth={1.75} /> Schedule Exam
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <SectionCard title="Today's Attendance">
            <p className="text-sm text-charcoal/70">
              {todaysAttendance.classesMarked} of {todaysAttendance.totalClasses} classes marked
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-charcoal/50">Present</p>
                <p className="font-medium text-forest">{todaysAttendance.present}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-charcoal/50">Absent</p>
                <p className="font-medium text-red-700">{todaysAttendance.absent}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-charcoal/50">Late</p>
                <p className="font-medium text-brass">{todaysAttendance.late}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-charcoal/50">Excused</p>
                <p className="font-medium text-charcoal/70">{todaysAttendance.excused}</p>
              </div>
            </div>
          </SectionCard>

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
        </div>

        <div className="flex flex-col gap-6">
          <SectionCard title="Recent Activity">
            {activity.length === 0 ? (
              <p className="text-sm text-charcoal/50">Nothing yet.</p>
            ) : (
              <div className="flex flex-col divide-y divide-rule">
                {activity.map((a, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 py-2 text-sm">
                    <span className="text-charcoal/70">{a.message}</span>
                    <span className="shrink-0 text-xs text-charcoal/40">{timeAgo(a.timestamp)}</span>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard title="Notifications">
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
