/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // RefillWatch palette: warm earth, terracotta, sage, cream.
        cream: {
          50:  '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E5E4',
        },
        terracotta: {
          400: '#F87171',
          500: '#DC2626',
          600: '#991B1B',
        },
        sage: {
          400: '#60A5FA',
          500: '#2563EB',
          600: '#1E40AF',
        },
        rose: {
          deep: '#0F172A',
        },
        ink: {
          900: '#2A2422',
          700: '#4A4340',
          500: '#6E6863',
        },
      },
      fontFamily: {
        // Headlines: serif with personality. Body: clean sans.
        display: ['"Fraunces"', 'Georgia', 'serif'],
        sans:    ['"Inter"', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        prose: '68ch',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
