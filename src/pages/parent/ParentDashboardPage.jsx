import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { getParentOverview } from "../../api/dashboard.api";
import StatCard from "../../components/shared/StatCard";
import SectionCard from "../../components/shared/SectionCard";
import { Award, TrendingUp, CheckCircle2 } from "lucide-react";

export default function ParentDashboardPage() {
  const [data, setData] = useState(null);
  const [selectedChildId, setSelectedChildId] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchOverview = useCallback(async (childId) => {
    setLoading(true);
    try {
      const { data } = await getParentOverview(childId);
      setData(data.data);
      if (data.data.selected) setSelectedChildId(data.data.selected.id);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  const handleChildChange = (e) => {
    const childId = e.target.value;
    setSelectedChildId(childId);
    fetchOverview(childId);
  };

  if (loading || !data) {
    return <div className="p-4 sm:p-6 md:p-10 text-sm text-charcoal/60">Loading overview...</div>;
  }

  if (data.children.length === 0) {
    return (
      <div className="p-4 sm:p-6 md:p-10">
        <p className="text-xs uppercase tracking-[0.2em] text-brass">Overview</p>
        <h1 className="mt-1 font-display text-2xl text-ink">No children linked yet</h1>
        <p className="mt-2 text-sm text-charcoal/60">
          Contact the school office to have your account linked to your child's record.
        </p>
      </div>
    );
  }

  const { children, selected, attendancePercentage, currentAverage, upcomingExams, assignmentsDue, recentNotifications } =
    data;

  return (
    <div className="p-4 sm:p-6 md:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {selected?.photoUrl ? (
            <img
              src={selected.photoUrl}
              alt={selected.fullName}
              className="h-16 w-16 rounded-full border-2 border-brass object-cover shadow-sm"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-brass bg-rule text-lg font-medium text-charcoal/60">
              {selected?.fullName?.[0]}
            </div>
          )}
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-brass">Overview</p>
            <h1 className="font-display text-2xl text-ink sm:text-3xl">{selected?.fullName}</h1>
            <p className="text-sm text-charcoal/50">{selected?.className || "No class assigned yet"}</p>
          </div>
        </div>

        {/* Child selector - only meaningful with more than one linked child */}
        {children.length > 1 && (
          <select
            value={selectedChildId}
            onChange={handleChildChange}
            className="border-b border-rule bg-transparent py-2 text-sm text-charcoal outline-none focus:border-brass"
          >
            {children.map((c) => (
              <option key={c.id} value={c.id}>
                {c.fullName}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
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
        <Link
          to="/parent/report-card"
          className="flex items-center gap-2 rounded-sm border border-rule px-4 py-2 text-sm text-ink transition-colors hover:border-brass hover:text-brass w-fit"
        >
          <Award size={15} strokeWidth={1.75} /> View Report Card
        </Link>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
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

          <SectionCard title="Pending Assignments">
            {assignmentsDue.length === 0 ? (
              <p className="text-sm text-forest">Nothing pending.</p>
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

        <SectionCard title="Latest Announcements">
          {recentNotifications.length === 0 ? (
            <p className="text-sm text-charcoal/50">Nothing new.</p>
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
  );
}
