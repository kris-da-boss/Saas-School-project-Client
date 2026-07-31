import Button from "../../components/ui/Button";

const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function TimetableView({ entries, onEdit, onDelete }) {
  const byDay = DAY_ORDER.map((day) => ({
    day,
    items: entries
      .filter((e) => e.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime)),
  }));

  return (
    <div className="flex flex-col gap-6">
      {byDay.map(({ day, items }) => (
        <div key={day}>
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-brass">{day}</p>
          {items.length === 0 ? (
            <p className="text-sm text-charcoal/40">No lessons scheduled</p>
          ) : (
            <div className="divide-y divide-rule border-y border-rule">
              {items.map((entry) => (
                <div
                  key={entry._id}
                  className="flex items-center justify-between gap-3 px-2 py-3 transition-colors hover:bg-ink/[0.02]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">
                      {entry.startTime} – {entry.endTime} · {entry.subjectId?.name}
                    </p>
                    <p className="truncate text-xs text-charcoal/50">
                      {entry.teacherId ? entry.teacherId.fullName : "No teacher assigned"}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button size="sm" variant="ghost" onClick={() => onEdit(entry)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="dangerGhost" onClick={() => onDelete(entry._id)}>
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
