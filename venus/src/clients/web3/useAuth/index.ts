import { CHAIN_ID } from 'config';
import { useWallets, useWeb3React } from '@romeblockchain/wallet';

const useAuth = () => {
  const { account, chainId, isActive, connector } = useWeb3React();
  const { selectedWallet, setSelectedWallet } = useWallets();

  function logOut() {
    if (connector.deactivate) {
      connector.deactivate();
    } else {
      connector?.resetState();
    }

    setSelectedWallet(undefined);
  }

  return {
    logOut,
    accountAddress: account,
    connectedWallet: selectedWallet,
    isUnsupportedChainId: chainId !== CHAIN_ID,
    isActive,
  };
};

export default useAuth;
