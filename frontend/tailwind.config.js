/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "lh-black": "#0a0a0a",
        "lh-ink": "#121212",
        "lh-coal": "#1a1a1a",
        "lh-gold": "#d4af37",
        "lh-gold-light": "#f0d78c",
        "lh-ivory": "#f5f0e6",
        "lh-ivory-muted": "#a8a399",
      },
      fontFamily: {
        sans: ['"DM Sans"', "system-ui", "-apple-system", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
      boxShadow: {
        glass: "0 4px 24px rgba(0, 0, 0, 0.35)",
      },
    },
  },
  plugins: [],
};
