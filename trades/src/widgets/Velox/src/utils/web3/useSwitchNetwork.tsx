import { getAddChainParametersfromNetworkName, useWeb3React } from '@romeblockchain/wallet';

import { ChainID } from './types';

export type NetworkParams = {
  chainId: ChainID; // A 0x-prefixed hexadecimal chainId
  chainName: string; // Network name. e.g. Avalanche FUJI C-Chain
  nativeCurrency: {
    name: string; // 'Avalanche`
    symbol: string; // 'AVAX'
    decimals: number; // 18
  };
  rpcUrl: string; // 'https://api.avax-test.network/ext/bc/C/rpc'
  blockExplorerUrl: string; // 'https://api.avax-test.network/ext/bc/C/rpc'
};

export const useSwitchNetwork = () => {
  const { connector  } = useWeb3React();
  const switchNetwork = (networkName:any /**todo NetworkName from wallertContext**/)=>{
    const chainParams = getAddChainParametersfromNetworkName(networkName)
    connector.activate(chainParams)
  }

  return { connector, switchNetwork };
};
