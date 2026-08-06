export default function SectionCard({ title, children, action }) {
  return (
    <div className="border border-rule p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-xs uppercase tracking-[0.2em] text-brass">{title}</p>
        {action}
      </div>
      {children}
    </div>
  );
}
