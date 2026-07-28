export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2 px-6 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-brass">Access restricted</p>
      <h1 className="font-display text-2xl font-semibold text-ink">
        Your account can't open this page
      </h1>
      <p className="text-sm text-charcoal/70">Contact your school administrator if this seems wrong.</p>
    </div>
  );
}
