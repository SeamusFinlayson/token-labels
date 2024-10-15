/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        mirage: {
          50: "#f4f5f9",
          100: "#eaedf5",
          200: "#dde1ee",
          300: "#c1c8e0",
          400: "#898fa7",
          500: "#6a708d",
          600: "#555974",
          700: "#464a5e",
          800: "#3d4051",
          900: "#2d3143",
          940: "#24283b",
          950: "#222639",
        },
        primary: {
          DEFAULT: "#9966ff",
          dark: "#bb99ff",
        },
      }
    },
  },
  plugins: [],
};
