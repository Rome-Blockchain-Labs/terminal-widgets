module.exports = {
  mode: 'jit',
  purge: ['/src/**.*.tsx'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
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
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
