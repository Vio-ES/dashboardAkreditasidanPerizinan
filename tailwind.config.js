/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#0c1a3a",
        navy2: "#132449",
        "navy-hover": "#1a2f5c",
        blue: { DEFAULT: "#2f6fed", dark: "#1e4fc4", bg: "#eaf1ff" },
        green: { DEFAULT: "#12a454", bg: "#e6f9ee" },
        orange: { DEFAULT: "#e88a1b", bg: "#fff3e0" },
        purple: { DEFAULT: "#7c4dee", bg: "#f2ecff" },
        teal: { DEFAULT: "#0d9c93", bg: "#e2f8f6" },
        red: { DEFAULT: "#e0433c" },
        ink: { DEFAULT: "#182238", soft: "#5b6478", faint: "#8991a3" },
        line: "#e7eaf1",
        surface: "#eef1f8",
        card: "#ffffff",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,24,54,.04), 0 8px 24px -12px rgba(16,24,54,.10)",
      },
      borderRadius: {
        card: "16px",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        lemlat: {
          "primary": "#15406A",
          "primary-content": "#f2faff",
          "secondary": "#56849F",
          "secondary-content": "#f2faff",
          "accent": "#6bb5e2",
          "accent-content": "#f8faf5",
          "neutral": "#0d1529",
          "neutral-content": "#f5f6f8",
          "base-100": "#f8f9fa",
          "base-200": "#f0f2f5",
          "base-300": "#dedfe5",
          "base-content": "#2e333d",
          "info": "#A0BECD",
          "info-content": "#0d1529",
          "success": "#85CB33",
          "success-content": "#0d1529",
          "warning": "#FFD23F",
          "warning-content": "#0d1529",
          "error": "#B3001B",
          "error-content": "#fef5f6",
        },
      },
    ],
  },
};
