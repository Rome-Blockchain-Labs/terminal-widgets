import { useWallets } from '../../../../../contexts/WalletsContext/WalletContext';
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
  const { connector, error, switchNetwork } = useWallets();

  return { connector, error, switchNetwork };
};
