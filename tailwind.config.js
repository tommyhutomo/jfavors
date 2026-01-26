/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          pink: "#FFD1DC",
          rose: "#F6D1C1",
          peach: "#FDD5B1",
          blue: "#AEC6CF",
          babyblue: "#89CFF0",
          lavender: "#E3E4FA",
          periwinkle: "#C3CDE6",
          green: "#77DD77",
          mint: "#AAF0D1",
          teagreen: "#D0F0C0",
          yellow: "#FDFD96",
          cream: "#FFFDD0",
          gray: "#CFCFC4"
        },
        brand: {
          DEFAULT: "#89CFF0",
          50: "#f1f8ff",
          100: "#dff1ff",
          200: "#bfe4ff",
          300: "#9fd6ff",
          400: "#7fc9ff",
          500: "#89CFF0",
          600: "#65b1db",
          700: "#4d92b7",
          800: "#3c728f",
          900: "#2f576f"
        }
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Noto Sans", "Ubuntu", "Cantarell", "Helvetica Neue", "Arial", "sans-serif"]
      },
      boxShadow: {
        soft: "0 10px 25px -10px rgba(137,207,240,0.35)"
      }
    },
  },
  darkMode: 'class',
  plugins: [],
};
