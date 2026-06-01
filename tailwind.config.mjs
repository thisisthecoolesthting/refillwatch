import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#F8FAFC",
          100: "#EEF0F2",
          200: "#DFE1E3",
        },
        terracotta: {
          400: "#FD2C2C",
          500: "#DC2626",
          600: "#B41F1F",
        },
        sage: {
          400: '#60A5FA',
          500: '#2563EB',
          600: '#1E40AF',
        },
        rose: {
          deep: '#1E3A8A',
        },
        ink: {
          900: "#0B1120",
          700: "#334155",
          500: "#64748B",
        },
      },
      fontFamily: {
        display: ['Archivo', "Georgia", "serif"],
        sans: ['Inter', "system-ui", "sans-serif"],
      },
      maxWidth: {
        site: "72rem",
        prose: '68ch',
      },
    },
  },
  plugins: [typography],
};
