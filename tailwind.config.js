// tailwind.config.js
const colors = require('tailwindcss/colors')

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        truegray: colors.trueGray,
        mejito: '#41ffca'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
