/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Editorial/academic palette - think fine stationery & registrar ledgers,
        // not a generic SaaS blue or the cream+terracotta AI-default look.
        ink: "#1B2A4A", // deep navy - primary
        parchment: "#F7F3EA", // warm off-white background
        forest: "#2F4739", // secondary - deep green
        brass: "#B08D57", // accent - muted brass/gold, used sparingly
        charcoal: "#22252B", // body text
        rule: "#D8CFBC", // hairline divider color (ledger-line motif)
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["Inter", "sans-serif"],
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(-4px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.15s ease-out",
      },
    },
  },
  plugins: [],
};
