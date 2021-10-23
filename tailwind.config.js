// tailwind.config.js
const colors = require('tailwindcss/colors')

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
   // maxWidth: {
      //'xxs': '18rem'
    //},
    extend: {
      maxWidth: {
        'xxs': '18rem'
      },
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
