export default function Button({ children, variant = "primary", className = "", ...props }) {
  const base =
    "px-5 py-2.5 text-sm font-medium tracking-wide transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-ink text-parchment hover:bg-forest",
    outline: "border border-ink text-ink hover:bg-ink hover:text-parchment",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
