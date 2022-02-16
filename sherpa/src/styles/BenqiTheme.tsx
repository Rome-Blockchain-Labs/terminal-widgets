import { createGlobalStyle } from 'styled-components'
import tw from 'twin.macro'

const BenqiTheme = createGlobalStyle`
  .benqi-widget {
    --color-dark-100: 64,74,85;
    --color-dark-200: 62,68,78;
    --color-dark-300: 40,44,52;
    --color-dark-400: 32,35,41;
    --color-dark-500: 31,35,40;
    --color-dark-600: 29,29,29;
    --color-dark-700: 28,32,37;
    --color-dark-800: 22,22,22;
    --color-dark-900: 10,10,10;

    --color-gray-100: 67,79,91;
    --color-gray-200: 112,112,112;
    --color-gray-300: 119,119,119;
    --color-gray-400: 148,148,148;
    --color-gray-500: 164,164,164;
    --color-gray-600: 185,185,185;
    --color-gray-700: 191,191,191;
    --color-gray-800: 203,203,203;
    --color-gray-900: 210,210,210;

    --color-blue-100: 0,16,22;
    --color-blue-200: 0,36,48;
    --color-blue-400: 234,250,255;
    --color-blue-500: 8,121,158;
    --color-blue-600: 145,228,255;
    --color-blue-700: 94,216,255;
    --color-blue-800: 0,179,237;
    --color-blue-900: 49,157,226;

    --color-supply: 0,179,237;
    --color-borrow: 245,188,124;

    --font-9xs-size: .5625rem;
    --font-8xs-size: .6875rem;
    --font-7xs-size: .75rem;
    --font-6xs-size: .8125rem;
    --font-5xs-size: .875rem;
    --font-4xs-size: .9375rem;
    --font-3xs-size: 1.125rem;
    --font-2xs-size: 1.25rem;
    --font-xs-size: 1.3125rem;
    --font-sm-size: 1.375rem;
    --font-base-size: 1.5rem;
    --font-md-size: 1.625rem;
    --font-lg-size: 1.75rem;
    --font-xl-size: 1.875rem;
    --font-2xl-size: 2.25rem;
    --font-3xl-size: 2.3125rem;
    --font-4xl-size: 2.375rem;
    --font-5xl-size: 2.8125rem;
    --font-6xl-size: 3.5rem;
    --font-7xl-size: 4rem;
    --font-8xl-size: 4.625rem;
    --font-9xl-size: 5rem;

    --line-height-1: .6875rem;
    --line-height-2: .8125rem;
    --line-height-3: .875rem;
    --line-height-4: 1rem;
    --line-height-5: 1.0625rem;
    --line-height-6: 1.125rem;
    --line-height-7: 1.3125rem;
    --line-height-8: 1.375rem;
    --line-height-9: 1.5rem;
    --line-height-10: 1.5625rem;
    --line-height-11: 1.6875rem;
    --line-height-12: 1.75rem;
    --line-height-13: 1.8125rem;
    --line-height-14: 2rem;
    --line-height-15: 2.125rem;
    --line-height-16: 2.25rem;
    --line-height-17: 2.6875rem;
    --line-height-18: 2.75rem;
    --line-height-19: 4.1875rem;
    --line-height-20: 4.5rem;
    --line-height-21: 6.0625rem;
    --line-height-none: 1;

    -webkit-tap-highlight-color: transparent;
    ${tw`antialiased font-condensed text-white m-0`}

    button {
      ${tw`uppercase cursor-pointer`}

      &:focus {
        ${tw`outline-none`}
      }
    }

    img {
      ${tw`select-none`}
      -webkit-user-drag: none;
    }

    a {
      ${tw`no-underline`}
    }

    .walletconnect-modal__mobile__toggle a {
      ${tw`text-dark-900`}
    }
  }

  @media (min-width: 560px) {
    .widget-enlargement-1 .benqi-widget, .widget-enlargement-2 .benqi-widget {
      --font-9xs-size: .7625rem;
      --font-8xs-size: .8875rem;
      --font-7xs-size: .975rem;
      --font-6xs-size: 1.1125rem;
      --font-5xs-size: 1.275rem;
      --font-4xs-size: 1.3375rem;
      --font-3xs-size: 1.425rem;
      --font-2xs-size: 1.55rem;
      --font-xs-size: 1.6125rem;
      --font-sm-size: 1.775rem;
      --font-base-size: 1.8rem;
      --font-md-size: 1.925rem;
    }
  }
`

export default BenqiTheme
