export default function StatCard({ icon: Icon, label, value, accent = false }) {
  return (
    <div className="border border-rule bg-parchment p-4 transition-colors hover:border-brass/50">
      <div className="flex items-center gap-2 text-charcoal/50">
        {Icon && <Icon size={16} strokeWidth={1.75} />}
        <p className="text-xs uppercase tracking-widest">{label}</p>
      </div>
      <p className={`mt-2 font-display text-2xl ${accent ? "text-brass" : "text-ink"}`}>{value}</p>
    </div>
  );
}
