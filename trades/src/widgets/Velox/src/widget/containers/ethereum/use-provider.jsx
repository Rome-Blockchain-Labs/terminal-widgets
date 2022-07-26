import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useWallets } from '../../../../../../contexts/WalletsContext/WalletContext';
import { PROVIDER_DISCONNECT } from '../../../redux/sharedActions';
import { updateConnection } from '../../../redux/wallet/walletSlice';

function useProvider() {
  const dispatch = useDispatch();
  const { chainHex, connected } = useSelector(
    (state) => state?.velox?.wallet.connection
  );
  const { account, active, chainId, connector, disconnectFromWallet, provider } = useWallets();

  useEffect(() => {
    if (chainHex === chainId) return;

    dispatch(updateConnection({ chainHex: chainId }));
  }, [chainId, chainHex, dispatch]);

  const toggleConnected = async () => {
    if (!connected) {
      await connector.activate();

      // next line is a for for: https://giters.com/NoahZinsmeister/web3-react/issues/257
      //@ts-ignore
      window?.ethereum?.removeAllListeners(['networkChanged']);
      dispatch(updateConnection({ account, chainHex: chainId, connected: true }));
    } else {
      disconnectFromWallet();
      dispatch({ type: PROVIDER_DISCONNECT });
    }
  };

  return { active, deactivate: disconnectFromWallet, provider, toggleConnected };
}

export default useProvider;
