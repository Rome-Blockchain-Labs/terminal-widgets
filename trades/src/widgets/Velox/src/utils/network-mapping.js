import { multiChains } from '@rbl/velox-common';

import IconAvascan from '../assets/icons/icon-avascan.svg';
import IconBscscan from '../assets/icons/icon-bscscan.svg';
import IconEtherscan from '../assets/icons/icon-Etherscan.svg';
const { NETWORKS } = multiChains;

//todo rely on velox-common for this
export const composeEtherscanAddressUrl = (chainHex, address) => {
  switch (chainHex) {
    case '0x1':
      return `https://etherscan.io/address/${address}`;
    case '0x3':
      return `https://ropsten.etherscan.io/address/${address}`;
    case '0x4':
      return `https://rinkeby.etherscan.io/address/${address}`;
    case '0x5':
      return `https://goerli.etherscan.io/address/${address}`;
    case '0x2a':
      return `https://kovan.etherscan.io/address/${address}`;
    case '0xa869':
      return `https://testnet.snowtrace.io/address/${address}`;
    case '0xa86a':
      return `https://snowtrace.io/address/${address}`;
    case '0x38':
      return `https://bscscan.com/address/${address}`;
    default:
      return '';
    // default: throw new Error("Could not identify network")
  }
};

export const composeEtherscanTxUrl = (chainHex, hash) => {
  switch (chainHex) {
    case NETWORKS.ETHEREUM.MAINNET.CHAIN_ID:
      return `https://etherscan.io/tx/${hash}`;
    case NETWORKS.ETHEREUM.ROPSTEN.CHAIN_ID:
      return `https://ropsten.etherscan.io/tx/${hash}`;
    case NETWORKS.ETHEREUM.RINKEBY.CHAIN_ID:
      return `https://rinkeby.etherscan.io/tx/${hash}`;
    case '5':
      return `https://goerli.etherscan.io/tx/${hash}`;
    case '42':
      return `https://kovan.etherscan.io/tx/${hash}`;
    case NETWORKS.AVALANCHE.FUJI.CHAIN_ID:
      return `https://testnet.snowtrace.io/tx/${hash}`;
    case NETWORKS.AVALANCHE.MAINNET.CHAIN_ID:
      return `https://snowtrace.io/tx/${hash}`;
    case NETWORKS.BSC.MAINNET.CHAIN_ID:
      return `https://bscscan.com/tx/${hash}`;
    default:
      return '';
    // default: throw new Error("Could not identify network")
  }
};
export const detailsByChain = (chainIdHex) => {
  const chainId = parseInt(chainIdHex).toString();
  switch (chainId) {
    case NETWORKS.ETHEREUM.MAINNET.CHAIN_ID:
      return {
        explorerIcon: IconEtherscan,
        nativeTokenName: 'Ethereum',
      };
    case NETWORKS.ETHEREUM.RINKEBY.CHAIN_ID:
      return {
        explorerIcon: IconEtherscan,
        nativeTokenName: 'Ethereum',
      };
    case NETWORKS.AVALANCHE.MAINNET.CHAIN_ID:
      return {
        explorerIcon: IconAvascan,
        nativeTokenName: 'Avalanche',
      };
    case NETWORKS.AVALANCHE.FUJI.CHAIN_ID:
      return {
        explorerIcon: IconAvascan,
        nativeTokenName: 'Avalanche',
      };
    case NETWORKS.BSC.MAINNET.CHAIN_ID:
      return {
        explorerIcon: IconBscscan,
        nativeTokenName: 'BSC',
      };
    default:
      return {
        explorerIcon: IconEtherscan,
        nativeTokenName: 'Native token',
      };
  }
};

export const chainIdToBlockchainName = (chainId) => {
  if ([1, 3, 4, 5, 42, '1', '3', '4', '5', '42'].includes(parseInt(chainId))) {
    return NETWORKS.ETHEREUM.NAME;
  }
  if (parseInt(chainId) === parseInt(NETWORKS.AVALANCHE.MAINNET.CHAIN_ID)) {
    return NETWORKS.AVALANCHE.NAME;
  }
  if (parseInt(chainId) === parseInt(NETWORKS.BSC.MAINNET.CHAIN_ID)) {
    return NETWORKS.BSC.NAME;
  }
  // eslint-disable-next-line 
  throw `Could not find blockchain name for chainId:${chainId}`;
};
