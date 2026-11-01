/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        midnight: "#101d38",
        royal: "#182b50",
        champagne: "#c8a86b",
        ivory: "#f8f4ec",
      },
      fontFamily: {
        display: ["Georgia", "serif"],
        sans: ["Arial", "Helvetica", "sans-serif"]
      }
    },
  },
  plugins: [],
};
