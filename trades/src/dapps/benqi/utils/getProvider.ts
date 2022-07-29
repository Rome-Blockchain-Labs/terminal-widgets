import type { Provider } from '@web3-react/types';
import { ethers } from 'ethers';
type MetaMaskProvider = Provider & {
  isMetaMask?: boolean;
  isConnected?: () => boolean;
  providers?: MetaMaskProvider[];
};
const getProvider = async () => {
  const activeWallet = window.localStorage.getItem('activeWallet');
  if (activeWallet && activeWallet === 'coinbase') {
    const m = await import('@coinbase/wallet-sdk');
    const coinbaseWallet = new m.default({
      appName: 'rometerminal',
      reloadOnDisconnect: false,
    });
    const provider = coinbaseWallet.makeWeb3Provider(
      'https://api.avax.network/ext/bc/C/rpc',
      43114
    );
    //@ts-ignore
    const web3provider = new ethers.providers.Web3Provider(provider);
    return web3provider;
  }

  const m = await import('@metamask/detect-provider');

  const provider = (await m.default({
    mustBeMetaMask: true,
  })) as MetaMaskProvider;

  const web3provider = new ethers.providers.Web3Provider(provider);
  return web3provider;
  //@ts-ignore
  // return new ethers.providers.Web3Provider(window.ethereum);
};

export default getProvider;
