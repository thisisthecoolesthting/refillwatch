import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx,svelte,vue}"],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
        },
        navy: {
          DEFAULT: "#1E3A8A",
          600: "#1E40AF",
          700: "#1D4ED8",
        },
        terracotta: {
          400: "#F87171",
          500: "#DC2626",
          600: "#991B1B",
        },
        primary: { DEFAULT: "#1E3A8A" },
        accent: { DEFAULT: "#DC2626" },
        sage: { 400: "#8FA888", 500: "#6F8B6A", 600: "#566F52" },
        rose: { deep: "#0B1120" },
        ink: {
          900: "#0B1120",
          700: "#334155",
          500: "#64748B",
        },
      },
      maxWidth: {
        prose: "68ch",
        site: "72rem",
      },
      typography: {
        DEFAULT: { css: { maxWidth: "68ch" } },
        ink: { css: { color: "#334155" } },
      },
      fontFamily: {
        display: ["Archivo", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [typography],
};
