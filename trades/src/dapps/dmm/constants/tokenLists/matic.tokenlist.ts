import { KYBER_MAINNET_ENV } from '../../../../config';

export const MATIC_TOKEN_LIST = {
  keywords: ['kyberswap', 'dmmexchange'],
  name: 'KyberSwap Token List',
  timestamp: '2020-12-12T00:00:00+00:00',
  tokens: [
    {
      address:
        KYBER_MAINNET_ENV === 'staging'
          ? '0x51E8D106C646cA58Caf32A47812e95887C071a62'
          : '0x1C954E8fe737F99f68Fa1CCda3e51ebDB291948C',
      chainId: 137,
      decimals: 18,
      name: 'Kyber Network Crystal',
      symbol: 'KNC',
    },
    {
      address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      chainId: 137,
      decimals: 18,
      name: 'Ether',
      symbol: 'ETH',
    },
    {
      address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      chainId: 137,
      decimals: 6,
      name: 'USDC',
      symbol: 'USDC',
    },
    {
      address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
      chainId: 137,
      decimals: 6,
      name: 'USDT',
      symbol: 'USDT',
    },
    {
      address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
      chainId: 137,
      decimals: 18,
      name: 'DAI',
      symbol: 'DAI',
    },
    {
      address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
      chainId: 137,
      decimals: 18,
      name: 'Wrapped Matic',
      symbol: 'WMATIC',
    },
    {
      address: '0x3A3e7650f8B9f667dA98F236010fBf44Ee4B2975',
      chainId: 137,
      decimals: 18,
      name: 'xDollar Stablecoin',
      symbol: 'XUSD',
    },
    {
      address: '0x3Dc7B06dD0B1f08ef9AcBbD2564f8605b4868EEA',
      chainId: 137,
      decimals: 18,
      name: 'xDollar',
      symbol: 'XDO',
    },
    {
      address: '0x4e3Decbb3645551B8A19f0eA1678079FCB33fB4c',
      chainId: 137,
      decimals: 18,
      logoURI: 'https://i.imgur.com/92uhfao.png',
      name: 'Jarvis Synthetic Euro',
      symbol: 'jEUR',
    },
    {
      address: '0x767058F11800FBA6A682E73A6e79ec5eB74Fac8c',
      chainId: 137,
      decimals: 18,
      logoURI: 'https://i.imgur.com/HS7BMfs.png',
      name: 'Jarvis Synthetic British Pound',
      symbol: 'jGBP',
    },
    {
      address: '0xbD1463F02f61676d53fd183C2B19282BFF93D099',
      chainId: 137,
      decimals: 18,
      logoURI: 'https://i.imgur.com/Fp31dDB.png',
      name: 'Jarvis Synthetic Swiss Franc',
      symbol: 'jCHF',
    },
    {
      address: '0x00e5646f60AC6Fb446f621d146B6E1886f002905',
      chainId: 137,
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/14004/small/RAI-logo-coin.png?1613592334',
      name: 'Rai Reflex Index',
      symbol: 'RAI',
    },
    {
      address: '0xfAdE2934b8E7685070149034384fB7863860D86e',
      chainId: 137,
      decimals: 18,
      logoURI: 'https://i.imgur.com/PyipL43.png',
      name: 'Aureus',
      symbol: 'AUR-0112',
    },
    {
      address: '0xc1c93D475dc82Fe72DBC7074d55f5a734F8cEEAE',
      chainId: 137,
      decimals: 18,
      logoURI:
        'https://raw.githubusercontent.com/stevepegaxy/assets/master/blockchains/polygon/assets/0xc1c93D475dc82Fe72DBC7074d55f5a734F8cEEAE/logo.png',
      name: 'Pegaxy Stone',
      symbol: 'PGX',
    },
    {
      address: '0xcC1B9517460D8aE86fe576f614d091fCa65a28Fc',
      chainId: 137,
      decimals: 18,
      logoURI:
        'https://raw.githubusercontent.com/stevepegaxy/assets/master/blockchains/polygon/assets/0xcC1B9517460D8aE86fe576f614d091fCa65a28Fc/logo.png',
      name: 'Vigorus',
      symbol: 'VIS',
    },
    {
      address: '0x6Fb2415463e949aF08ce50F83E94b7e008BABf07',
      chainId: 137,
      decimals: 18,
      name: 'Aureus',
      symbol: 'AUR-FEB22',
    },
  ],
  version: {
    major: 0,
    minor: 0,
    patch: 0,
  },
};
