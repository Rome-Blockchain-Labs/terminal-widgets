/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('tailwindcss').Config} */
const { fontFamily, screens } = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      ...fontFamily,
      sans: ['Montserrat', 'ui-sans-serif', 'system-ui', '-apple-system'],
      roboto: ['Roboto'],
    },
    screens: {
      wg: '510px',
      ...screens,
    },
    extend: {
      colors: {
        'success-border': '#B7EB8F',
        'success-bg': '#F6FFED',
        'warning-border': '#FFE58F',
        'warning-bg': '#FFFBE6',
        'info-border': '#91D5FF',
        'info-bg': '#E6F7FF',
        'error-border': '#FFCCC7',
        'error-bg': '#FFF2F0',
        midnight: '#00070E',
        november: '#7A808A',
        sour: '#C1FF00',
        winter: '#B4BBC7',
      },
    },
  },
  variants: {
    scrollbar: ['rounded'],
  },

  plugins: [require('@tailwindcss/forms'), require('tailwind-scrollbar')],
}
