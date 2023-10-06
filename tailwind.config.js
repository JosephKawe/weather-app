/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        isLight: "-18px 18px 36px #1d9497, 18px -18px 36px #2de8eb",
        isDark: "-18px 18px 36px #292929, 18px -18px 36px #373737"
      },
      fontFamily: {
        ubuntu: "Ubuntu, sans-serif"
      },
      fontSize:{
        "10xl": "9em",
        "1.5xl": "1.6em"
      },
      screens: {
        'mobile-landscape' : '640px'
      }
    },
  },
  plugins: [],
}

