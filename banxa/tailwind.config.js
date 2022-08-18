/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('tailwindcss').Config} */
const { fontFamily } = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      ...fontFamily,
      sans: ['Montserrat', 'ui-sans-serif', 'system-ui', '-apple-system'],
    },
  },
  variants: {
    scrollbar: ['rounded'],
  },
  plugins: [require('@tailwindcss/forms'), require('tailwind-scrollbar')],
}
