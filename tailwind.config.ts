import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "1rem", screens: { "2xl": "1200px" } },
    extend: {
      colors: {
        rotary: { DEFAULT: "#005DAA", dark: "#004A88", light: "#E6F0F9" },
        gold: { DEFAULT: "#F7A81B", dark: "#D98F0A", light: "#FEF3DC" },
        navy: { DEFAULT: "#0B1F3A", soft: "#16304F" },
        slate: { blue: "#5B6B80" },
        surface: "#F5F7FA",
      },
      fontFamily: { sans: ["var(--font-inter)", "system-ui", "sans-serif"] },
      borderRadius: { card: "1.25rem" },
      boxShadow: { soft: "0 4px 24px -6px rgba(11,31,58,0.12)", lift: "0 12px 32px -8px rgba(11,31,58,0.22)" },
    },
  },
  plugins: [],
};
export default config;
