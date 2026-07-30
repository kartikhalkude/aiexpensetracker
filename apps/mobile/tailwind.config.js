/** @type {import('tailwindcss').Config} */

module.exports = {
  presets: [
    require("nativewind/preset")
  ],

  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],

  theme: {
    extend: {
      colors: {
        primary: {
          500: "#6366F1",
          600: "#4F46E5",
          700: "#4338CA"
        }
      }
    }
  },

  plugins: []
};