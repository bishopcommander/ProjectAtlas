/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        atlas: {
          bg: "#f7f5ef",
          accent: "#b45309",
          "accent-dark": "#92400e"
        }
      },
      fontFamily: {
        sans: ["'IBM Plex Sans'", "sans-serif"]
      }
    }
  },
  plugins: []
};
