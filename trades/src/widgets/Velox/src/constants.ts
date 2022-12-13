import { enableRinkeby } from './config';
import { NetworkParams } from './utils/web3';

export const STEP1 = 'step1';
export const STEP2 = 'step2';
export const STEP3 = 'step3';
export const STEP4 = 'step4';

//SUPPORTED_CHAIN_IDS should be consolidated into network-mapping chainIds
export const SUPPORTED_CHAIN_IDS = enableRinkeby
  ? [1, 4, 43113, 43114, 56]
  : [1, 43114, 56];

export const TEST_NETWORKS: { [network: string]: NetworkParams } = {
  avalanche: {
    blockExplorerUrl: 'https://testnet.snowtrace.io/',
    chainId: 43113,
    chainName: 'Avalanche FUJI C-Chain Test',
    nativeCurrency: {
      decimals: 18,
      name: 'Avalanche',
      symbol: 'AVAX',
    },
    rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
  },
  bsc: {
    blockExplorerUrl: 'https://bscscan.com/',
    chainId: 56,
    chainName: 'BNB Chain Main Network',
    nativeCurrency: {
      decimals: 18,
      name: 'BNB',
      symbol: 'BNB',
    },
    rpcUrl: 'https://bsc-dataseed1.ninicoin.io',
  },
};

export const MAIN_NETWORKS: { [network: string]: NetworkParams } = {
  avalanche: {
    blockExplorerUrl: 'https://snowtrace.io',
    chainId: 43114,
    chainName: 'Avalanche Main Network',
    nativeCurrency: {
      decimals: 18,
      name: 'Avalanche',
      symbol: 'AVAX',
    },
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
  },
  bsc: {
    blockExplorerUrl: 'https://bscscan.com/',
    chainId: 56,
    chainName: 'BNB Chain Main Network',
    nativeCurrency: {
      decimals: 18,
      name: 'BNB',
      symbol: 'BNB',
    },
    rpcUrl: 'https://bsc-dataseed1.ninicoin.io',
  },
  ethereum: {
    blockExplorerUrl: 'https://etherscan.io',
    chainId: 1,
    chainName: 'Ethereum Main Network',
    nativeCurrency: {
      decimals: 18,
      name: 'Ethereum',
      symbol: 'ETH',
    },
    rpcUrl: '',
  },
};

export const SUPPORTED_NETWORKS: { [network: string]: NetworkParams } =
  enableRinkeby ? TEST_NETWORKS : MAIN_NETWORKS;

export const getNetworkParams = (blockchain: string): NetworkParams => {
  return SUPPORTED_NETWORKS[blockchain.toLowerCase()];
};
