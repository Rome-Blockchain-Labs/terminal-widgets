import * as ethers from 'ethers';
import keyBy from 'lodash/keyBy';

import { Pair } from '../../types';

/** Types **/
export type WalletName =
  | 'metamask'
  | 'coinbase'
  | 'walletconnect'
  | 'network'
  | 'unknown';
//these types should match https://github.com/Rome-Blockchain-Labs/rome-backend/tree/main/collectors/evm/networks
export enum NetworkName {
  ETHEREUM = 'ethereum',
  AVALANCHE = 'avalanche',
  BINANCE = 'bsc',
  FUJI = 'fuji',
  MOONBEAM = 'moonbeam',
  MOONRIVER = 'moonriver',
  METIS = 'metis',
  RINKEBY = 'rinkeby',
  OPTIMISM = 'optimism',
  POLYGON = 'polygon',
  DFK = 'dfk',
  KLAYTN = 'klaytn',
}

export enum NetworkChainId {
  ETHEREUM = 1,
  AVALANCHE = 43114,
  BINANCE = 56,
  FUJI = 43113,
  MOONBEAM = 1284,
  MOONRIVER = 1285,
  METIS = 1088,
  RINKEBY = 4,
  OPTIMISM = 10,
  POLYGON = 137,
  DFK = 53935,
  KLAYTN = 8217,
}
export type NetworkChainHex = `0x${string}`;

export type possiblyNativeCurrency = {
  decimals: 18;
  name: string;
  symbol: string;
  isNative?: boolean;
};

//these types should match https://github.com/Rome-Blockchain-Labs/rome-backend/tree/main/collectors/evm/networks
export enum ExchangeType {
  MDEX = 'mdex',
  PANGOLIN = 'pangolin',
  TRADERJOE = 'traderjoe',
  PANCAKESWAP = 'pancakeswap',
  SAFESWAP = 'safeswap',
  BEAMSWAP = 'beamswap',
  SOLARBEAM = 'solarbeam',
  NETSWAP = 'netswap',
  SUSHISWAP = 'sushiswap',
  UNISWAPV2 = 'uniswapv2',
  UNISWAPV3 = 'uniswapv3',
  CRYSTALVALE = 'crystalvale',
  SERENDALE = 'serendale',
  NOTEXCHANGE = 'notexchange',
}

/** Constants **/
type NetworkParam = {
  chainHex: NetworkChainHex;
  chainId: number;
  name: NetworkName;
  provider: ethers.providers.BaseProvider;
  supportingWallets: Array<WalletName>;
  blockExplorerUrl: string;
  nativeCurrency: possiblyNativeCurrency;
  rpcUrl: string;
  exchanges: Array<{ name: ExchangeType }>; //todo add routers and factory and init codes ect
};

const ETHEREUM_NETWORK_PARAM: NetworkParam = {
  blockExplorerUrl: 'https://etherscan.io/',
  chainHex: '0x1',
  chainId: NetworkChainId.ETHEREUM,
  exchanges: [
    { name: ExchangeType.UNISWAPV2 },
    { name: ExchangeType.SUSHISWAP },
  ],
  name: NetworkName.ETHEREUM,
  nativeCurrency: {
    decimals: 18,
    isNative: true,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  provider: new ethers.providers.JsonRpcProvider(
    'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161' //todo
  ),
  rpcUrl: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  //todo
  supportingWallets: ['metamask', 'coinbase'],
};

const AVALANCHE_TEST_NETWORK_PARAM: NetworkParam = {
  blockExplorerUrl: 'https://cchain.explorer.avax-test.network',
  chainHex: '0xA869',
  chainId: NetworkChainId.FUJI,
  exchanges: [],
  name: NetworkName.FUJI,
  nativeCurrency: {
    decimals: 18,
    isNative: true,
    name: 'Avalanche',
    symbol: 'AVAX',
  },
  provider: new ethers.providers.JsonRpcProvider(
    'https://api.avax-test.network/ext/bc/C/rpc'
  ),
  rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
  supportingWallets: ['metamask', 'coinbase'],
};

const AVALANCHE_NETWORK_PARAM: NetworkParam = {
  blockExplorerUrl: 'https://snowtrace.io/',
  chainHex: '0xa86a',
  chainId: NetworkChainId.AVALANCHE,
  exchanges: [
    { name: ExchangeType.PANGOLIN },
    { name: ExchangeType.TRADERJOE },
    // { name: ExchangeType.AXIAL },
  ],
  name: NetworkName.AVALANCHE,
  nativeCurrency: {
    decimals: 18,
    isNative: true,
    name: 'Avalanche',
    symbol: 'AVAX',
  },
  provider: new ethers.providers.JsonRpcProvider(
    'https://api.avax.network/ext/bc/C/rpc'
  ),
  rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
  supportingWallets: ['metamask', 'coinbase'],
};

const BINANCE_NETWORK_PARAM: NetworkParam = {
  blockExplorerUrl: 'https://bscscan.com/',
  chainHex: '0x38',
  chainId: NetworkChainId.BINANCE,
  exchanges: [{ name: ExchangeType.MDEX }, { name: ExchangeType.PANCAKESWAP }],
  name: NetworkName.BINANCE,
  nativeCurrency: {
    decimals: 18,
    isNative: true,
    name: 'Binance Coin',
    symbol: 'BNB',
  },
  provider: new ethers.providers.JsonRpcProvider(
    'https://bsc-dataseed.binance.org'
  ),
  rpcUrl: 'https://bsc-dataseed.binance.org',
  supportingWallets: ['metamask', 'coinbase'],
};

const MOONBEAM_NETWORK_PARAM: NetworkParam = {
  blockExplorerUrl: 'https://moonbeam.moonscan.io/',
  chainHex: '0x504',
  chainId: NetworkChainId.MOONBEAM,
  exchanges: [{ name: ExchangeType.BEAMSWAP }],
  name: NetworkName.MOONBEAM,
  nativeCurrency: {
    decimals: 18,
    isNative: true,
    name: 'MoonBeam',
    symbol: 'GLMR',
  },
  provider: new ethers.providers.JsonRpcProvider(
    'https://rpc.api.moonbeam.network'
  ),
  rpcUrl: 'https://rpc.api.moonbeam.network',
  supportingWallets: ['metamask', 'coinbase'],
};

const MOONRIVER_NETWORK_PARAM: NetworkParam = {
  blockExplorerUrl: 'https://moonriver.moonscan.io/',
  chainHex: '0x505',
  chainId: NetworkChainId.MOONRIVER,
  exchanges: [{ name: ExchangeType.SOLARBEAM }],
  name: NetworkName.MOONRIVER,
  nativeCurrency: {
    decimals: 18,
    isNative: true,
    name: 'MoonRiver',
    symbol: 'MOVR',
  },
  provider: new ethers.providers.JsonRpcProvider(
    'https://rpc.moonriver.moonbeam.network'
  ),
  rpcUrl: 'https://rpc.moonriver.moonbeam.network',
  supportingWallets: ['metamask', 'coinbase'],
};

const METIS_NETWORK_PARAM: NetworkParam = {
  blockExplorerUrl: 'https://andromeda-explorer.metis.io/',
  chainHex: '0x440',
  chainId: NetworkChainId.METIS,
  exchanges: [{ name: ExchangeType.NETSWAP }],
  name: NetworkName.METIS,
  nativeCurrency: {
    decimals: 18,
    isNative: true,
    name: 'METIS',
    symbol: 'METIS',
  },
  provider: new ethers.providers.JsonRpcProvider(
    'https://andromeda.metis.io/?owner=1088'
  ),
  rpcUrl: 'https://andromeda.metis.io/?owner=1088',
  supportingWallets: ['metamask', 'coinbase'],
};
const OPTIMISM_NETWORK_PARAM: NetworkParam = {
  blockExplorerUrl: 'https://optimistic.etherscan.io',
  chainHex: '0xA',
  chainId: NetworkChainId.OPTIMISM,
  exchanges: [],
  name: NetworkName.OPTIMISM,
  nativeCurrency: {
    decimals: 18,
    isNative: true,
    name: 'Optimism',
    symbol: 'OP',
  },
  provider: new ethers.providers.JsonRpcProvider('https://mainnet.optimism.io'),
  rpcUrl: 'https://mainnet.optimism.io',
  supportingWallets: ['metamask', 'coinbase'],
};

const POLYGON_NETWORK_PARAM: NetworkParam = {
  blockExplorerUrl: 'https://polygonscan.com/',
  chainHex: '0x89',
  chainId: NetworkChainId.POLYGON,
  exchanges: [
    { name: ExchangeType.SUSHISWAP },
    { name: ExchangeType.UNISWAPV3 },
  ],
  name: NetworkName.POLYGON,
  nativeCurrency: {
    decimals: 18,
    isNative: true,
    name: 'Matic',
    symbol: 'MATIC',
  },
  provider: new ethers.providers.JsonRpcProvider(
    'https://polygon-mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
  ),
  rpcUrl:
    'https://polygon-mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  supportingWallets: ['metamask', 'coinbase'],
};

const DFK_NETWORK_PARAM: NetworkParam = {
  blockExplorerUrl: 'https://subnets.avax.network/defi-kingdoms',
  chainHex: '0xD2AF',
  chainId: NetworkChainId.DFK,
  exchanges: [{ name: ExchangeType.CRYSTALVALE }],
  name: NetworkName.DFK,
  nativeCurrency: {
    decimals: 18,
    isNative: true,
    name: 'JEWEL',
    symbol: 'JEWEL',
  },
  provider: new ethers.providers.JsonRpcProvider(
    'https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc'
  ),
  rpcUrl: 'https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc',
  supportingWallets: ['metamask', 'coinbase'],
};

const KLAYTN_NETWORK_PARAM: NetworkParam = {
  blockExplorerUrl: 'https://scope.klaytn.com/',
  chainHex: '0x2019',
  chainId: NetworkChainId.KLAYTN,
  exchanges: [{ name: ExchangeType.SERENDALE }],
  name: NetworkName.KLAYTN,
  nativeCurrency: {
    decimals: 18,
    isNative: true,
    name: 'Klay',
    symbol: 'Klay',
  },
  provider: new ethers.providers.JsonRpcProvider(
    'https://public-node-api.klaytnapi.com/v1/cypress'
  ),
  rpcUrl: 'https://public-node-api.klaytnapi.com/v1/cypress',
  supportingWallets: ['metamask', 'coinbase'],
};

const networkParams: Array<NetworkParam> = [
  ETHEREUM_NETWORK_PARAM,
  AVALANCHE_NETWORK_PARAM,
  BINANCE_NETWORK_PARAM,
  AVALANCHE_TEST_NETWORK_PARAM,
  MOONBEAM_NETWORK_PARAM,
  MOONRIVER_NETWORK_PARAM,
  METIS_NETWORK_PARAM,
  OPTIMISM_NETWORK_PARAM,
  POLYGON_NETWORK_PARAM,
  DFK_NETWORK_PARAM,
  KLAYTN_NETWORK_PARAM,
];

/** Getters
 * This can probably be imported/exported from other files
 * **/

const networkParamsByName = keyBy(networkParams, 'name');
const networkParamsByChainHex = keyBy(networkParams, 'chainHex');
const networkParamsByChainId = keyBy(networkParams, 'chainId');
//////////////////////////////////
export const getNetworkParamByNetworkName = (networkName: NetworkName) => {
  const found = networkParamsByName[networkName];
  if (found) return found;
  throw new Error(`Invalid network name:${networkName}`);
};
export const getNetworkParamByChainId = (chainid: NetworkChainId) => {
  const found = networkParamsByChainId[chainid];
  if (found) return found;
  throw new Error(`Invalid chain id:${chainid}`);
};

export const getChainHexByNetworkName = (networkName: NetworkName) =>
  getNetworkParamByNetworkName(networkName).chainHex;
export const getChainIdByNetworkName = (networkName: NetworkName) =>
  getNetworkParamByNetworkName(networkName).chainId;
export const getProviderForNetworkName = (networkName: NetworkName) =>
  getNetworkParamByNetworkName(networkName).provider;
export const getBlockExplorerUrlForChainId = (chainId: NetworkChainId) =>
  getNetworkParamByChainId(chainId).blockExplorerUrl;
export const getBlockExplorerUrlForNetworkName = (networkName: NetworkName) =>
  getNetworkParamByNetworkName(networkName).blockExplorerUrl;
export const getSupportedWalletsForNetworkName = (networkName: NetworkName) =>
  getNetworkParamByNetworkName(networkName).supportingWallets;

//////////////////////////////////
export const getNetworkNameFromChainHex = (chainHex: string) => {
  const found = networkParamsByChainHex[chainHex];
  if (found) return found.name;
  throw new Error(`Invalid network chainHex:${chainHex}`);
};
///////////////////////////////////////
export const getNetworkNameFromChainId = (chainId: number) => {
  const found = networkParamsByChainId[chainId];
  if (found) return found.name;
  return null;
};
///////////////////////////////////
export const getSupportedNetworksNameByWallet = (walletName: WalletName) =>
  networkParams
    .filter((n) => n.supportingWallets.includes(walletName))
    .map((n) => n.name);
///////////////////////////////////
export const exchangeIsOnNetwork = (
  networkName: NetworkName,
  exchange?: ExchangeType
) =>
  getNetworkParamByNetworkName(networkName).exchanges.some(
    (e) => e.name === exchange
  );
///////////////////////////////////
export const getNativeTokenFromNetworkName = (networkName: NetworkName) => ({
  ...getNetworkParamByNetworkName(networkName).nativeCurrency,
  isNative: true,
});
export const isNativeCurrency = (currency: any) => {
  return networkParams.some((params) => params.nativeCurrency === currency);
};
///////////////////////////////////
export const getBasePairByNetworkExchange = (
  network: NetworkName,
  exchange: ExchangeType
): Pair => {
  switch (network) {
    case NetworkName.AVALANCHE:
      const avalancheBasePair = {
        address: '',
        blockchain: NetworkName.AVALANCHE,
        exchange,
        token0: {
          address: '0xc7198437980c041c805A1EDcbA50c1Ce5db95118',
          decimals: 6,
          name: 'Tether USD',
          symbol: 'USDT.e',
        },
        token1: {
          address: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
          decimals: 18,
          name: 'Wrapped AVAX',
          symbol: 'WAVAX',
        },
      };

      if (exchange === ExchangeType.TRADERJOE) {
        avalancheBasePair.address =
          '0xeD8CBD9F0cE3C6986b22002F03c6475CEb7a6256';
      } else if (exchange === ExchangeType.PANGOLIN) {
        avalancheBasePair.address =
          '0xe28984e1EE8D431346D32BeC9Ec800Efb643eef4';
      } else {
        throw new Error(
          `There's no valid base pair for ${exchange} in ${network} network`
        );
      }

      return avalancheBasePair;
    case NetworkName.BINANCE:
      const binanceBasePair = {
        address: '',
        blockchain: NetworkName.BINANCE,
        exchange,
        token0: {
          address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
          decimals: 18,
          name: 'BUSD Token',
          symbol: 'BUSD',
        },
        token1: {
          address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
          decimals: 18,
          name: 'Wrapped BNB',
          symbol: 'WBNB',
        },
      };

      if (exchange === ExchangeType.PANCAKESWAP) {
        binanceBasePair.address = '0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16';
      } else if (exchange === ExchangeType.MDEX) {
        binanceBasePair.address = '0x340192D37d95fB609874B1db6145ED26d1e47744';
      } else {
        throw new Error(
          `There's no valid base pair for ${exchange} in ${network} network`
        );
      }

      return binanceBasePair;
    case NetworkName.MOONBEAM:
      const moonbeamBasePair = {
        address: '',
        blockchain: NetworkName.MOONBEAM,
        exchange,
        token0: {
          address: '0x818ec0A7Fe18Ff94269904fCED6AE3DaE6d6dC0b',
          decimals: 6,
          name: 'USD Coin',
          symbol: 'USDC',
        },
        token1: {
          address: '0xAcc15dC74880C9944775448304B263D191c6077F',
          decimals: 18,
          name: 'Wrapped GLMR',
          symbol: 'WGLMR',
        },
      };

      if (exchange === ExchangeType.BEAMSWAP) {
        moonbeamBasePair.address = '0xb929914B89584b4081C7966AC6287636F7EfD053';
      } else {
        throw new Error(
          `There's no valid base pair for ${exchange} in ${network} network`
        );
      }

      return moonbeamBasePair;
    case NetworkName.MOONRIVER:
      const moonriverBasePair = {
        address: '',
        blockchain: NetworkName.MOONRIVER,
        exchange,
        token0: {
          address: '0x98878B06940aE243284CA214f92Bb71a2b032B8A',
          decimals: 18,
          name: 'Wrapped MOVR',
          symbol: 'WMOVR',
        },
        token1: {
          address: '0x1A93B23281CC1CDE4C4741353F3064709A16197d',
          decimals: 18,
          name: 'Frax',
          symbol: 'FRAX',
        },
      };

      if (exchange === ExchangeType.SOLARBEAM) {
        moonriverBasePair.address =
          '0x2cc54b4A3878e36E1C754871438113C1117a3ad7';
      }

      return moonriverBasePair;
    case NetworkName.METIS:
      const metisBasePair = {
        address: '',
        blockchain: NetworkName.METIS,
        exchange,
        token0: {
          address: '0xdeaddeaddeaddeaddeaddeaddeaddeaddead0000',
          decimals: 18,
          name: 'Metis',
          symbol: 'METIS',
        },
        token1: {
          address: '0xbb06dca3ae6887fabf931640f67cab3e3a16f4dc',
          decimals: 6,
          name: 'USDT',
          symbol: 'm.USDT',
        },
      };

      if (exchange === ExchangeType.NETSWAP) {
        metisBasePair.address = '0x3D60aFEcf67e6ba950b499137A72478B2CA7c5A1';
      }

      return metisBasePair;
    case NetworkName.FUJI:
      return {} as any;
    case NetworkName.ETHEREUM:
      const ethereumBasePair = {
        address: '',
        blockchain: NetworkName.ETHEREUM,
        exchange,
        token0: {
          address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
          decimals: 6,
          name: 'USD Coin',
          symbol: 'USDC',
        },
        token1: {
          address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
          decimals: 18,
          name: 'Wrapped Ether',
          symbol: 'WETH',
        },
      };

      if (exchange === ExchangeType.SUSHISWAP) {
        ethereumBasePair.address = '0x397FF1542f962076d0BFE58eA045FfA2d347ACa0';
      } else if (exchange === ExchangeType.UNISWAPV2) {
        ethereumBasePair.address = '0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc';
      } else if (exchange === ExchangeType.UNISWAPV3) {
        ethereumBasePair.address = '0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640'; //todo which pool should be used
      } else if (exchange === ExchangeType.PANCAKESWAP) {
        ethereumBasePair.address = '0x2E8135bE71230c6B1B4045696d41C09Db0414226';
      } else {
        throw new Error(
          `There's no valid base pair for ${exchange} in ${network} network`
        );
      }

      return ethereumBasePair;
    case NetworkName.POLYGON:
      const polygonBasePair = {
        address: '',
        blockchain: NetworkName.POLYGON,
        exchange,
        token0: {
          address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
          decimals: 6,
          name: 'Tether USD',
          symbol: 'USDT',
        },
        token1: {
          address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
          decimals: 18,
          name: 'Wrapped Matic',
          symbol: 'WMATIC',
        },
      };

      if (exchange === ExchangeType.SUSHISWAP) {
        polygonBasePair.address = '0x55FF76BFFC3Cdd9D5FdbBC2ece4528ECcE45047e';
      } else if (exchange === ExchangeType.UNISWAPV3) {
        polygonBasePair.address = '0x9B08288C3Be4F62bbf8d1C20Ac9C5e6f9467d8B7';
      } else {
        throw new Error(
          `There's no valid base pair for ${exchange} in ${network} network`
        );
      }

      return polygonBasePair;
    case NetworkName.DFK:
      const dfkBasePair = {
        address: '',
        blockchain: NetworkName.DFK,
        exchange,
        token0: {
          address: '0x04b9dA42306B023f3572e106B11D82aAd9D32EBb',
          decimals: 18,
          name: 'Crystals',
          symbol: 'CRYSTAL',
        },
        token1: {
          address: '0xCCb93dABD71c8Dad03Fc4CE5559dC3D89F67a260',
          decimals: 18,
          name: 'Wrapped JEWEL',
          symbol: 'WJEWEL',
        },
      };

      if (exchange === ExchangeType.CRYSTALVALE) {
        dfkBasePair.address = '0x48658E69D741024b4686C8f7b236D3F1D291f386';
      } else {
        throw new Error(
          `There's no valid base pair for ${exchange} in ${network} network`
        );
      }

      return dfkBasePair;
    case NetworkName.KLAYTN:
      const klaytnBasePair = {
        address: '',
        blockchain: NetworkName.KLAYTN,
        exchange,
        token0: {
          address: '0x30C103f8f5A3A732DFe2dCE1Cc9446f545527b43',
          decimals: 18,
          name: 'JEWEL',
          symbol: 'JEWEL',
        },
        token1: {
          address: '0x19Aac5f612f524B754CA7e7c41cbFa2E981A4432',
          decimals: 18,
          name: 'Wrapped KLAY',
          symbol: 'WKLAY',
        },
      };

      if (exchange === ExchangeType.SERENDALE) {
        klaytnBasePair.address = '0x0d9d200720021F9de5C8413244f81087ecB4AdcC';
      } else {
        throw new Error(
          `There's no valid base pair for ${exchange} in ${network} network`
        );
      }

      return klaytnBasePair;
    default:
      throw new Error(
        `Invalid network: ${network} in getBasePairByNetworkExchange`
      );
  }
};
