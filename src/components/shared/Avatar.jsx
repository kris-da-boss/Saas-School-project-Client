const SIZES = {
  md: "h-12 w-12 text-sm",
  lg: "h-16 w-16 text-lg",
  xl: "h-20 w-20 text-xl",
};

// The brass ring echoes the sidebar's monogram badge - same signature
// treatment, applied wherever a real person's photo appears (student,
// child, etc.) rather than just decorative iconography.
export default function Avatar({ src, name, size = "md" }) {
  const sizeClasses = SIZES[size] || SIZES.md;

  if (src) {
    return (
      <img
        src={src}
        alt={name || "Photo"}
        className={`${sizeClasses} rounded-full border-2 border-brass object-cover`}
      />
    );
  }

  return (
    <div
      className={`flex ${sizeClasses} items-center justify-center rounded-full border-2 border-brass bg-rule font-medium text-charcoal/60`}
    >
      {name?.[0] || "?"}
    </div>
  );
}
