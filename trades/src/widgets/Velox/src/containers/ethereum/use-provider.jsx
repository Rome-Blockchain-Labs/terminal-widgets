import { useWallets, useWeb3React } from '@romeblockchain/wallet';
import { useDispatch, useSelector } from 'react-redux';

import { PROVIDER_DISCONNECT } from '../../redux/sharedActions';
import { updateConnection } from '../../redux/wallet/walletSlice';
import loggerWithCloud from '../../utils/logging/loggerWithCloud';

function useProvider() {
  const dispatch = useDispatch();
  const { connected } = useSelector((state) => state?.velox?.wallet.connection);
  const {
    account,
    chainId,
    connector,
    isActive: active,
    provider,
  } = useWeb3React();
  console.log('useprovider');
  const disconnectFromWallet = () => {
    if (connector.deactivate) {
      connector.deactivate();
    } else {
      connector.resetState();
    }
  };

  const toggleConnected = async () => {
    if (!connected) {
      await connector.activate();
      loggerWithCloud.setUserAddress(account);
      dispatch(
        updateConnection({ account, chainHex: chainId, connected: true })
      );

      // next line is a for for: https://giters.com/NoahZinsmeister/web3-react/issues/257
      //@ts-ignore
      window?.ethereum?.removeAllListeners(['networkChanged']);
    } else {
      disconnectFromWallet();
      dispatch({ type: PROVIDER_DISCONNECT });
    }
  };

  return {
    active,
    deactivate: disconnectFromWallet,
    provider,
    toggleConnected,
  };
}

export default useProvider;
