import type { AddEthereumChainParameter } from '@web3-react/types';

const ETH: AddEthereumChainParameter['nativeCurrency'] = {
  decimals: 18,
  name: 'Ether',
  symbol: 'ETH',
};

const MATIC: AddEthereumChainParameter['nativeCurrency'] = {
  decimals: 18,
  name: 'Matic',
  symbol: 'MATIC',
};

interface BasicChainInformation {
  urls: string[] | any[];
  name: string;
}

interface ExtendedChainInformation extends BasicChainInformation {
  nativeCurrency: AddEthereumChainParameter['nativeCurrency'];
  blockExplorerUrls: AddEthereumChainParameter['blockExplorerUrls'];
}

function isExtendedChainInformation(
  chainInformation: BasicChainInformation | ExtendedChainInformation
): chainInformation is ExtendedChainInformation {
  return !!(chainInformation as ExtendedChainInformation).nativeCurrency;
}

export function getAddChainParameters(
  chainId: number
): AddEthereumChainParameter | number {
  const chainInformation = CHAINS[chainId];
  if (isExtendedChainInformation(chainInformation)) {
    return {
      blockExplorerUrls: chainInformation.blockExplorerUrls,
      chainId,
      chainName: chainInformation.name,
      nativeCurrency: chainInformation.nativeCurrency,
      rpcUrls: chainInformation.urls,
    };
  } else {
    return chainId;
  }
}

export const CHAINS: {
  [chainId: number]: BasicChainInformation | ExtendedChainInformation;
} = {
  1: {
    name: 'Mainnet',
    urls: [
      process.env.REACT_APP_INFURA_KEY
        ? `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`
        : undefined,
      process.env.REACT_APP_ALCHEMY_KEY
        ? `https://eth-mainnet.alchemyapi.io/v2/${process.env.REACT_APP_ALCHEMY_KEY}`
        : undefined,
      'https://cloudflare-eth.com',
    ].filter((url) => url !== undefined),
  },
  // Optimism
  10: {
    blockExplorerUrls: ['https://optimistic.etherscan.io'],
    name: 'Optimism',
    nativeCurrency: ETH,
    urls: [
      process.env.REACT_APP_INFURA_KEY
        ? `https://optimism-mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`
        : undefined,
      'https://mainnet.optimism.io',
    ].filter((url) => url !== undefined),
  },

  // Polygon
  137: {
    blockExplorerUrls: ['https://polygonscan.com'],
    name: 'Polygon Mainnet',
    nativeCurrency: MATIC,
    urls: [
      process.env.REACT_APP_INFURA_KEY
        ? `https://polygon-mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`
        : undefined,
      'https://polygon-rpc.com',
    ].filter((url) => url !== undefined),
  },

  3: {
    name: 'Ropsten',
    urls: [
      process.env.REACT_APP_INFURA_KEY
        ? `https://ropsten.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`
        : undefined,
    ].filter((url) => url !== undefined),
  },

  4: {
    name: 'Rinkeby',
    urls: [
      process.env.REACT_APP_INFURA_KEY
        ? `https://rinkeby.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`
        : undefined,
    ].filter((url) => url !== undefined),
  },

  42: {
    name: 'Kovan',
    urls: [
      process.env.REACT_APP_INFURA_KEY
        ? `https://kovan.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`
        : undefined,
    ].filter((url) => url !== undefined),
  },

  // Arbitrum
  42161: {
    blockExplorerUrls: ['https://arbiscan.io'],
    name: 'Arbitrum One',
    nativeCurrency: ETH,
    urls: [
      process.env.REACT_APP_INFURA_KEY
        ? `https://arbitrum-mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`
        : undefined,
      'https://arb1.arbitrum.io/rpc',
    ].filter((url) => url !== undefined),
  },

  421611: {
    blockExplorerUrls: ['https://testnet.arbiscan.io'],
    name: 'Arbitrum Testnet',
    nativeCurrency: ETH,
    urls: [
      process.env.REACT_APP_INFURA_KEY
        ? `https://arbitrum-rinkeby.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`
        : undefined,
      'https://rinkeby.arbitrum.io/rpc',
    ].filter((url) => url !== undefined),
  },

  5: {
    name: 'Görli',
    urls: [
      process.env.REACT_APP_INFURA_KEY
        ? `https://goerli.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`
        : undefined,
    ].filter((url) => url !== undefined),
  },

  69: {
    blockExplorerUrls: ['https://kovan-optimistic.etherscan.io'],
    name: 'Optimism Kovan',
    nativeCurrency: ETH,
    urls: [
      process.env.REACT_APP_INFURA_KEY
        ? `https://optimism-kovan.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`
        : undefined,
      'https://kovan.optimism.io',
    ].filter((url) => url !== undefined),
  },
  80001: {
    blockExplorerUrls: ['https://mumbai.polygonscan.com'],
    name: 'Polygon Mumbai',
    nativeCurrency: MATIC,
    urls: [
      process.env.REACT_APP_INFURA_KEY
        ? `https://polygon-mumbai.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`
        : undefined,
    ].filter((url) => url !== undefined),
  },
};

export const URLS: { [chainId: number]: string[] } = Object.keys(
  CHAINS
).reduce<{ [chainId: number]: string[] }>((accumulator, chainId) => {
  const validURLs: string[] = CHAINS[Number(chainId)].urls;

  if (validURLs.length) {
    accumulator[Number(chainId)] = validURLs;
  }

  return accumulator;
}, {});
