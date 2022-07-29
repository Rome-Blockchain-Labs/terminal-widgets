import {
  getBlockExplorerUrlForNetworkName,
  NetworkName,
} from '../constants/networkExchange';

export const getTxLink = (blockchain: NetworkName, txHash: string) => {
  const blockExplorerUrl = getBlockExplorerUrlForNetworkName(blockchain);
  return `${blockExplorerUrl}/tx/${txHash}`;
};

export const getTxAbbr = (txHash: string) =>
  `${txHash.slice(0, 7)}...${txHash.slice(txHash.length - 5)}`;

export const getAssetLogoLink = (blockchain: NetworkName, address: string) => {
  return `https://storage.googleapis.com/romenet-token-logos/${blockchain}/${address.toLowerCase()}/logo`;
};
