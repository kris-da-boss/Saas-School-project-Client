export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  const base =
    "rounded-sm font-medium tracking-wide transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const sizes = {
    md: "px-5 py-2.5 text-sm",
    sm: "px-3 py-1.5 text-xs",
  };
  const variants = {
    primary: "bg-ink text-parchment hover:bg-forest",
    outline: "border border-ink text-ink hover:bg-ink hover:text-parchment",
    ghost: "border border-rule text-charcoal/80 hover:border-brass hover:text-brass",
    dangerGhost: "border border-rule text-red-700 hover:border-red-700 hover:bg-red-50",
  };

  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
