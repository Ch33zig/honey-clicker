/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Edu AU VIC WA NT Pre"', 'sans-serif'], // Use the imported font name
      },
    },
  },
  plugins: [],
}
