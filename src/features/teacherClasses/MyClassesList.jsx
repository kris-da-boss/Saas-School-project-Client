import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyClasses } from "../../api/teacherClass.api";

export default function MyClassesList() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await getMyClasses();
        setClasses(data.data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p className="text-sm text-charcoal/60">Loading your classes...</p>;
  if (classes.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-charcoal/50">
        You're not assigned to any classes yet — an admin needs to set you as a homeroom teacher or
        add you to a class's timetable.
      </p>
    );
  }

  return (
    <div className="divide-y divide-rule border-y border-rule">
      {classes.map((cls) => (
        <div
          key={cls._id}
          className="flex flex-wrap items-center justify-between gap-3 px-2 py-4 transition-colors hover:bg-ink/[0.02]"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink">{cls.name}</p>
            {cls.classTeacherId && (
              <p className="truncate text-xs text-charcoal/50">Homeroom: {cls.classTeacherId.fullName}</p>
            )}
          </div>
          <div className="flex shrink-0 gap-2">
            <Link
              to={`/teacher/classes/${cls._id}/attendance`}
              className="rounded-sm border border-rule px-3 py-1.5 text-xs text-charcoal/80 transition-colors hover:border-brass hover:text-brass"
            >
              Attendance
            </Link>
            <Link
              to={`/teacher/assignments?classId=${cls._id}`}
              className="rounded-sm border border-rule px-3 py-1.5 text-xs text-charcoal/80 transition-colors hover:border-brass hover:text-brass"
            >
              Assignments
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
