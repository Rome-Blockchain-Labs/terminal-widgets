import { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import {
  Web3ReactHooks,
  Web3ReactProvider as DefaultWeb3ReactProvider,
} from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';
import { Network } from '@web3-react/network';
import { FC } from 'react';

import {
  coinbaseWallet,
  hooks as coinbaseWalletHooks,
} from '../../../../../connectors/coinbaseWallet';
import {
  hooks as metaMaskHooks,
  metaMask,
} from '../../../../../connectors/metaMask';
import {
  hooks as networkHooks,
  network,
} from '../../../../../connectors/network';

type Web3ReactProviderProps = {
  pollingInterval: number; // 12000 miliseconds by default
};

const connectors: [MetaMask | CoinbaseWallet | Network, Web3ReactHooks][] = [
  [metaMask, metaMaskHooks],
  [coinbaseWallet, coinbaseWalletHooks],
  [network, networkHooks],
];

export const Web3ReactProvider: FC<Web3ReactProviderProps> = ({ children }) => {
  return (
    <DefaultWeb3ReactProvider connectors={connectors}>
      {children}
    </DefaultWeb3ReactProvider>
  );
};
