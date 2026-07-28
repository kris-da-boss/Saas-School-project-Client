export default function Input({ label, id, error, className = "", ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-xs uppercase tracking-widest text-charcoal/70">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`border-b border-rule bg-transparent py-2 text-charcoal outline-none focus:border-brass ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-700">{error}</p>}
    </div>
  );
}
