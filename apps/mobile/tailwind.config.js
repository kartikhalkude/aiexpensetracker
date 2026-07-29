/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          900: '#312E81'
        },
        emerald: {
          500: '#10B981',
          600: '#059669'
        },
        rose: {
          500: '#F43F5E',
          600: '#E11D48'
        },
        dark: {
          bg: '#0F172A',
          card: '#1E293B',
          subtle: '#334155',
          border: '#475569'
        }
      }
    },
  },
  plugins: [],
}
