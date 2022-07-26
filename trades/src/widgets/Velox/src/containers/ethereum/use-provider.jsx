import { useDispatch, useSelector } from 'react-redux';

import { useWallets } from '../../../../../contexts/WalletsContext/WalletContext';
import { PROVIDER_DISCONNECT } from '../../redux/sharedActions';
import { updateConnection } from '../../redux/wallet/walletSlice';
import loggerWithCloud from '../../utils/logging/loggerWithCloud';

function useProvider() {
  const dispatch = useDispatch();
  const { connected } = useSelector((state) => state?.velox?.wallet.connection);
  const { account, active, chainId, connector, disconnectFromWallet, provider } = useWallets();

  const toggleConnected = async () => {
    if (!connected) {
      await connector.activate();
      loggerWithCloud.setUserAddress(account);
      dispatch(updateConnection({ account, chainHex: chainId, connected: true }));

      // next line is a for for: https://giters.com/NoahZinsmeister/web3-react/issues/257
      //@ts-ignore
      window?.ethereum?.removeAllListeners(['networkChanged']);
    } else {
      disconnectFromWallet();
      dispatch({ type: PROVIDER_DISCONNECT });
    }
  };

  return { active, deactivate: disconnectFromWallet, provider, toggleConnected };
}

export default useProvider;
