import { multiChains } from '@rbl/velox-common';

import { setDefaultNetworkName } from '../../utils/web3';
const { NETWORKS } = multiChains;

export type ExchangeParams = {
  key: string;
  tableSuffix: string;
  identifiers: {
    blockchain: string;
    chainId: string;
    exchange: string;
  };
};

export const rinkebyUniswap: ExchangeParams = {
  identifiers: {
    blockchain: NETWORKS.ETHEREUM.NAME,
    chainId: NETWORKS.ETHEREUM.RINKEBY.CHAIN_ID,
    exchange: NETWORKS.ETHEREUM.RINKEBY.UNISWAPV2.NAME,
  },
  key: 'rinkebyUniswap',
  tableSuffix: '_rinkeby_v2',
};

export const sushiswap: ExchangeParams = {
  identifiers: {
    blockchain: NETWORKS.ETHEREUM.NAME,
    chainId: NETWORKS.ETHEREUM.MAINNET.CHAIN_ID,
    exchange: NETWORKS.ETHEREUM.MAINNET.SUSHISWAP.NAME,
  },
  key: 'sushiswap',
  tableSuffix: `_${NETWORKS.ETHEREUM.MAINNET.SUSHISWAP.NAME.toLowerCase()}`,
};

export const uniswapV2: ExchangeParams = {
  identifiers: {
    blockchain: NETWORKS.ETHEREUM.NAME,
    chainId: NETWORKS.ETHEREUM.MAINNET.CHAIN_ID,
    exchange: NETWORKS.ETHEREUM.MAINNET.UNISWAPV2.NAME,
  },
  key: 'uniswapV2',
  tableSuffix: '',
};

export const uniswapV3: ExchangeParams = {
  identifiers: {
    blockchain: NETWORKS.ETHEREUM.NAME,
    chainId: NETWORKS.ETHEREUM.MAINNET.CHAIN_ID,
    exchange: NETWORKS.ETHEREUM.MAINNET.UNISWAPV3.NAME,
  },
  key: 'uniswapV3',
  tableSuffix: NETWORKS.ETHEREUM.MAINNET.UNISWAPV3.NAME.toLowerCase(),
};

export const pangolin: ExchangeParams = {
  identifiers: {
    blockchain: NETWORKS.AVALANCHE.NAME,
    chainId: NETWORKS.AVALANCHE.MAINNET.CHAIN_ID,
    exchange: NETWORKS.AVALANCHE.MAINNET.PANGOLIN.NAME,
  },
  key: 'pangolin',
  tableSuffix: NETWORKS.AVALANCHE.MAINNET.PANGOLIN.NAME.toLowerCase(),
};

export const traderjoe: ExchangeParams = {
  identifiers: {
    blockchain: NETWORKS.AVALANCHE.NAME,
    chainId: NETWORKS.AVALANCHE.MAINNET.CHAIN_ID,
    exchange: NETWORKS.AVALANCHE.MAINNET.TRADERJOE.NAME,
  },
  key: 'traderjoe',
  tableSuffix: NETWORKS.AVALANCHE.MAINNET.TRADERJOE.NAME.toLowerCase(),
};

export const pancakeswap: ExchangeParams = {
  identifiers: {
    blockchain: NETWORKS.BSC.NAME,
    chainId: NETWORKS.BSC.MAINNET.CHAIN_ID,
    exchange: NETWORKS.BSC.MAINNET.PANCAKESWAP.NAME,
  },
  key: 'pancakeswap',
  tableSuffix: NETWORKS.BSC.MAINNET.PANCAKESWAP.NAME.toLowerCase(),
};

export const EXCHANGES: { [key: string]: ExchangeParams } = {
  pancakeswap,
  pangolin,
  rinkebyUniswap,
  sushiswap,
  traderjoe,
  uniswapV2,
  uniswapV3,
};

const DEFAULT_EXCHANGE_NAME_KEY = 'default_exchange_name';

export const getDefaultExchangeName = () => {
  return localStorage.getItem(DEFAULT_EXCHANGE_NAME_KEY) || uniswapV2.key;
};

export const setDefaultExchangeName = (name: string) => {
  localStorage.setItem(DEFAULT_EXCHANGE_NAME_KEY, name);
};

export const getDefaultExchange = () => {
  return EXCHANGES[getDefaultExchangeName()];
};

export const setDefaultExchange = (exchange: ExchangeParams) => {
  setDefaultExchangeName(exchange.key);
  setDefaultNetworkName(exchange.identifiers.blockchain);
};
