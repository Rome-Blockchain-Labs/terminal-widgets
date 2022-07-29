import { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import { MetaMask } from '@web3-react/metamask';
import { Network } from '@web3-react/network';
import type { Connector } from '@web3-react/types';

export function getName(connector: Connector) {
  if (connector instanceof MetaMask) return 'metamask';
  if (connector instanceof CoinbaseWallet) return 'coinbase';
  if (connector instanceof Network) return 'network';
  return 'unknown';
}
