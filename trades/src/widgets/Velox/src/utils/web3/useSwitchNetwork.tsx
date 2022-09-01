import {
  getAddChainParametersfromNetworkName,
  useWeb3React,
} from '@romeblockchain/wallet';
import { MetaMask } from '@web3-react/metamask';
import { ethers } from 'ethers';

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
  const { connector } = useWeb3React();
  const switchNetwork = (
    networkName: any /**todo NetworkName from wallertContext**/
  ) => {
    const chainParams = getAddChainParametersfromNetworkName(networkName);
    connector.activate(chainParams);
    if (connector instanceof MetaMask) {
      connector.activate(chainParams);
    } else {
      if (typeof chainParams === 'number') {
        connector.activate(chainParams);
      } else {
        connector.provider?.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              ...chainParams,
              chainId: ethers.utils.hexValue(chainParams.chainId),
            },
          ],
        });
        connector.activate(chainParams.chainId);
      }
    }
  };

  return { connector, switchNetwork };
};
