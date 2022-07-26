import type { Provider } from '@web3-react/types';
type MetaMaskProvider = Provider & {
  isMetaMask?: boolean;
  isConnected?: () => boolean;
  providers?: MetaMaskProvider[];
};

const getAccount = async (): Promise<string> => {
  const activeWallet = window.localStorage.getItem('activeWallet');
  if (activeWallet && activeWallet === 'coinbase') {
    const m = await import('@coinbase/wallet-sdk');
    const coinbaseWallet = new m.default({ appName: 'rometerminal' });
    const provider = coinbaseWallet.makeWeb3Provider(
      'https://api.avax.network/ext/bc/C/rpc',
      43114
    );
    //@ts-ignore
    const accounts = (await provider.request({
      method: 'eth_accounts',
    })) as string[];
    return accounts[0];
  }

  const m = await import('@metamask/detect-provider');

  const provider = (await m.default({
    mustBeMetaMask: true,
  })) as MetaMaskProvider;
  const accounts = (await provider.request({
    method: 'eth_accounts',
  })) as string[];

  return accounts[0];
  //@ts-ignore
  // const accounts = await window.ethereum.request({
  //   method: 'eth_requestAccounts',
  // });
  // return accounts[0];
};

export default getAccount;
