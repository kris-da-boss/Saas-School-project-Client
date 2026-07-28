export default function SearchBar({ value, onChange, placeholder = "Search..." }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full max-w-xs border-b border-rule bg-transparent py-2 text-sm outline-none focus:border-brass"
    />
  );
}
