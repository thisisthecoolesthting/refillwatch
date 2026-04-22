import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#F8F5EE',
          100: '#F3EFE8',
          200: '#E7E0D6',
        },
        terracotta: {
          400: '#F87171',
          500: '#DC2626',
          600: '#B91C1C',
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
          900: '#0F172A',
          700: '#334155',
          500: '#64748B',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        prose: '68ch',
      },
    },
  },
  plugins: [typography],
};
