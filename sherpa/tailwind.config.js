/* eslint-disable sort-keys-fix/sort-keys-fix */

const { isObject, keys } = require('lodash')

const themeColors = {
  algorand: 'var(--color-algorand)',
  avalanche: 'var(--color-avalanche)',
  binance: 'var(--color-binance)',
  black: 'var(--color-black)',
  blue: {
    100: 'var(--color-blue-100)',
    200: 'var(--color-blue-200)',
    300: 'var(--color-blue-300)',
    400: 'var(--color-blue-400)',
    500: 'var(--color-blue-500)',
    600: 'var(--color-blue-600)',
    700: 'var(--color-blue-700)',
    800: 'var(--color-blue-800)',
    900: 'var(--color-blue-900)',
  },
  borrow: 'var(--color-borrow)',
  cardano: 'var(--color-cardano)',
  cosmos: 'var(--color-cosmos)',
  dark: {
    100: 'var(--color-dark-100)',
    200: 'var(--color-dark-200)',
    300: 'var(--color-dark-300)',
    400: 'var(--color-dark-400)',
    500: 'var(--color-dark-500)',
    600: 'var(--color-dark-600)',
    700: 'var(--color-dark-700)',
    800: 'var(--color-dark-800)',
    900: 'var(--color-dark-900)',
  },
  eos: 'var(--color-eos)',
  gray: {
    100: 'var(--color-gray-100)',
    200: 'var(--color-gray-200)',
    300: 'var(--color-gray-300)',
    400: 'var(--color-gray-400)',
    500: 'var(--color-gray-500)',
    600: 'var(--color-gray-600)',
    700: 'var(--color-gray-700)',
    800: 'var(--color-gray-800)',
    900: 'var(--color-gray-900)',
  },
  green: {
    400: 'var(--color-green-400)',
    500: 'var(--color-green-500)',
    700: 'var(--color-green-700)',
  },
  hedera: 'var(--color-hedera)',
  nuls: 'var(--color-nuls)',
  orange: {
    500: 'var(--color-orange-500)',
  },
  pink: {
    800: 'var(--color-pink-800)',
    900: 'var(--color-pink-900)',
  },
  polkadot: 'var(--color-polkadot)',
  red: {
    400: 'var(--color-red-400)',
    500: 'var(--color-red-500)',
  },
  solana: 'var(--color-solana)',
  stellar: 'var(--color-stellar)',
  supply: 'var(--color-supply)',
  tezos: 'var(--color-tezos)',
  transparent: 'transparent',
  tron: 'var(--color-tron)',
  white: 'var(--color-white)',
  yellow: {
    400: 'var(--color-yellow-400)',
    500: 'var(--color-yellow-500)',
  },
}

const withOpacity = (variable) => {
  return ({ opacityValue }) => {
    if (opacityValue) {
      return `rgba(${variable}, ${opacityValue})`
    }
    return `rgb(${variable})`
  }
}

const generateDefaultColors = (colors) => {
  const defaultColors = {}
  keys(colors).forEach((colorName) => {
    if (isObject(colors[colorName])) {
      defaultColors[colorName] = generateDefaultColors(colors[colorName])
    } else {
      defaultColors[colorName] = `rgb(${colors[colorName]})`
    }
  })

  return defaultColors
}

const generateBackgroundColors = (colors) => {
  const bgColors = {}
  keys(colors).forEach((colorName) => {
    if (isObject(colors[colorName])) {
      bgColors[colorName] = generateBackgroundColors(colors[colorName])
    } else {
      bgColors[colorName] = withOpacity(colors[colorName])
    }
  })

  return bgColors
}

module.exports = {
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      backgroundImage: {
        darkConnect: 'linear-gradient(180deg, transparent 0%, #001016 80%)',
        darkPage: 'linear-gradient(128deg, #006C8F 0%, #070707 100%)',
        lightConnect: 'linear-gradient(180deg, transparent 0%, white 80%)',
        lightPage: 'linear-gradient(236deg, #FFE1E1 0%, #DCF5FF 100%)',
      },
      borderRadius: {
        10: '.625rem',
        14: '.875rem',
        17: '1.0625rem',
        20: '1.25rem',
        28: '1.75rem',
        3: '.1875rem',
        6: '.375rem',
      },
      colors: generateDefaultColors(themeColors),
      backgroundColor: generateBackgroundColors(themeColors),
      height: {
        19: '4.75rem',
        '6/5': '120%',
        'fit-content': 'fit-content',
      },
      maxWidth: {
        100: '25rem',
        52: '13rem',
      },
      minWidth: {
        36: '9rem', // 144px
        screen: '100vw', // 100vw
      },
      minHeight: {
        'full-view': '100vh',
      },
      opacity: {
        15: '.15',
        33: '.33',
        50: '.5',
        72: '.72',
        83: '.83',
        85: '.85',
      },
      screens: {
        '3xl': '1920px',
      },
      spacing: {
        1.25: '.3125rem',
        12.5: '3.125rem',
        13: '3.25rem',
        17.5: '4.375rem',
        18: '4.5rem',
        2.5: '.625rem',
        23: '5.75rem',
        25: '6.25rem',
        27: '6.75rem',
        37.5: '9.375rem',
        4.5: '1.125rem',
        5.5: '1.375rem',
        50: '12.5rem',
        55: '13.75rem',
        6.25: '1.5625rem',
        6.5: '1.625rem',
        7.5: '1.875rem',
        75: '18.75rem',
        85: '21.25rem',
      },
      transitionProperty: {
        size: 'width, height',
      },
      width: {
        'fit-content': 'fit-content',
      },
      zIndex: {
        '-1': '-1',
      },
      lineHeight: {
        1: 'var(--line-height-1)',
        2: 'var(--line-height-2)',
        3: 'var(--line-height-3)',
        4: 'var(--line-height-4)',
        5: 'var(--line-height-5)',
        6: 'var(--line-height-6)',
        7: 'var(--line-height-7)',
        8: 'var(--line-height-8)',
        9: 'var(--line-height-9)',
        10: 'var(--line-height-10)',
        11: 'var(--line-height-11)',
        12: 'var(--line-height-12)',
        13: 'var(--line-height-13)',
        14: 'var(--line-height-14)',
        15: 'var(--line-height-15)',
        16: 'var(--line-height-16)',
        17: 'var(--line-height-17)',
        18: 'var(--line-height-18)',
        19: 'var(--line-height-19)',
        20: 'var(--line-height-20)',
        21: 'var(--line-height-21)',
        none: 'var(--line-height-none)',
      },
    },
    fontFamily: {
      condensed: ['Roboto Condensed'],
      fira: ['Fira Code', 'monospace'],
      roboto: ['Roboto', 'sans-serif'],
      sans: ['Montserrat', 'ui-sans-serif', 'system-ui', '-apple-system'],
    },
    fontSize: {
      '9xs': 'var(--font-9xs-size)',
      '8xs': 'var(--font-8xs-size)',
      '7xs': 'var(--font-7xs-size)',
      '6xs': 'var(--font-6xs-size)',
      '5xs': 'var(--font-5xs-size)',
      '4xs': 'var(--font-4xs-size)',
      '3xs': 'var(--font-3xs-size)',
      '2xs': 'var(--font-2xs-size)',
      xs: ['var(--font-xs-size)', { lineHeight: 'var(--font-xs-line-height)' }],
      sm: ['var(--font-sm-size)', { lineHeight: 'var(--font-sm-line-height)' }],
      md: 'var(--font-md-size)',
      base: [
        'var(--font-base-size)',
        { lineHeight: 'var(--font-base-line-height)' },
      ],
      lg: ['var(--font-lg-size)', { lineHeight: 'var(--font-lg-line-height)' }],
      xl: ['var(--font-xl-size)', { lineHeight: 'var(--font-xl-line-height)' }],
      '2xl': 'var(--font-2xl-size)',
      '3xl': 'var(--font-3xl-size)',
      '4xl': 'var(--font-4xl-size)',
      '5xl': 'var(--font-5xl-size)',
      '6xl': 'var(--font-6xl-size)',
      '7xl': 'var(--font-7xl-size)',
      '8xl': 'var(--font-8xl-size)',
      '9xl': 'var(--font-9xl-size)',
    },
  },
}
