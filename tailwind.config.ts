import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "1.5rem", screens: { "2xl": "1180px" } },
    extend: {
      colors: {
        rotary: { DEFAULT: "#005DAA", dark: "#004A88", light: "#E6F0F9" },
        gold: { DEFAULT: "#F7A81B", dark: "#E29A12", light: "#FEF3DC" },
        navy: { DEFAULT: "#0B1F3A", soft: "#16304F" },
        slate: { blue: "#566780" },
        surface: "#F5F7FA",
        mist: { DEFAULT: "#EEF3F8", dark: "#E4EDF6" },
        ink: "#17283E",
        line: "#D9E2EC",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      borderRadius: { card: "1.25rem", panel: "2.5rem" },
      boxShadow: { soft: "0 4px 24px -6px rgba(11,31,58,0.12)", lift: "0 12px 32px -8px rgba(11,31,58,0.22)" },
      transitionTimingFunction: {
        "out-quint": "cubic-bezier(.23,1,.32,1)",
        "in-out-cubic": "cubic-bezier(.645,.045,.355,1)",
      },
    },
  },
  plugins: [],
};
export default config;
