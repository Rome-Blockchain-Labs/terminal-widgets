import { createGlobalStyle } from 'styled-components';

const RTTheme = createGlobalStyle`
  body {
    --color-algorand: 127,255,0;
    --color-avalanche: 0,248,255;
    --color-binance: 119,0,255;
    --color-black: 0,0,0;

    --color-blue-400: 0,248,255;
    --color-blue-500: 0,137,255;

    --color-cardano: 248,158,56;
    --color-cosmos: 255,204,0;

    --color-dark-400: 27,33,42;
    --color-dark-500: 28,36,48;
    --color-dark-600: 18,24,31;
    --color-dark-700: 7,14,21;
    --color-dark-900: 0,7,14;

    --color-eos: 255,0,111;

    --color-gray-100: 224,227,234;
    --color-gray-200: 180,187,199;
    --color-gray-300: 122,128,138;
    --color-gray-400: 81,89,103;
    --color-gray-500: 46,54,67;
    --color-gray-600: 32,37,47;
    --color-gray-700: 33,41,51;
    --color-gray-800: 35,47,59;

    --color-green-300: 193,255,0;
    --color-green-400: 49,203,157;
    --color-green-500: 0,195,14;
    --color-green-700: 31,43,48;
    
    --color-winter: 180,187,199;
    --color-storm: 47,53,66;
    --color-navy: 35,44,56;
    --color-hedera: 204,255,0;
    --color-nuls: 255,255,0;
    --color-orange-500: 255,195,0;
    --color-pink-800: 253,0,255;
    --color-pink-900: 255,0,170;
    --color-polkadot: 0,206,255;
    --color-red-400: 197,0,54;
    --color-red-500: 232,65,66;
    --color-solana: 0,111,255;
    --color-stellar: 187,0,255;
    --color-tezos: 255,0,0;
    --color-tron: 255,0,255;
    --color-white: 255,255,255;
    --color-yellow-400: 193,255,0;
    --color-yellow-500: 239,255,0;

    --font-base-size: 0.625rem;
    --font-base-line-height: 1;

    --font-lg-size: 0.6875rem;
    --font-lg-line-height: 1;

    --font-sm-size: 0.5rem;
    --font-sm-line-height: 1;

    --font-xl-size: 0.75rem;
    --font-xl-line-height: 0.875rem;

    --font-xs-size: 0.4375rem;
    --font-xs-line-height: 1;

    --line-height-3: .75rem;
    --line-height-4: 1rem;
    --line-height-5: 1.25rem;
    --line-height-6: 1.5rem;
    --line-height-7: 1.75rem;
    --line-height-8: 2rem;
    --line-height-9: 2.25rem;
    --line-height-10: 2.5rem;
    --line-height-none: 1;
  }
`;

export default RTTheme;
