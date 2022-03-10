module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      gridTemplateRows: {
        8: 'repeat(8, minmax(0, 1fr))',
      },
      backgroundImage: {
        darkConnect: 'linear-gradient(180deg, transparent 0%, #001016 80%)',
        darkPage: 'linear-gradient(128deg, #006C8F 0%, #070707 100%)',
        lightConnect: 'linear-gradient(180deg, transparent 0%, white 80%)',
        lightPage: 'linear-gradient(236deg, #FFE1E1 0%, #DCF5FF 100%)',
        'sherpa-bg': `url(/images/sherpa-bg.jpg)`,
      },
      fontSize: {
        xs: 'clamp(1rem, 10vmin, 20rem)',
      },
      fontFamily: {
        sans: 'Roboto',
      },
      colors: {
        primary: '#03283D',
        secondary: '#19A99D',
      },
    },
  },
  plugins: [],
}
