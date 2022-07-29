import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { NetworkName } from '../../../../../constants/networkExchange';
import { useWallets } from '../../../../../contexts/WalletsContext/WalletContext';
import { enableVeloxWidgetMode } from '../../config';
import { SUPPORTED_CHAIN_IDS } from '../../constants';
import { updateConnection } from '../../redux/wallet/walletSlice';
import { useSwitchNetwork } from './useSwitchNetwork';
import { getDefaultNetworkName } from './util';

export const useWeb3Provider = (): any => {
  const dispatch = useDispatch();
  const {
    account,
    chainId,
    connector,
    disconnectFromWallet,
    promptWalletChange,
    ...restParams
  } = useWallets();
  const { switchNetwork } = useSwitchNetwork();

  useEffect(() => {
    if (
      !enableVeloxWidgetMode &&
      chainId &&
      !SUPPORTED_CHAIN_IDS.includes(chainId)
    ) {
      const defaultNetwork = getDefaultNetworkName();
      switchNetwork(defaultNetwork as NetworkName);
    }
  }, [chainId, switchNetwork]);

  useEffect(() => {
    if (!account) return;

    dispatch(updateConnection({ account, chainHex: chainId, connected: true }));
  }, [account, chainId, dispatch]);

  const isUnsupportedChainId = !chainId;

  return {
    ...restParams,
    account,
    activate: promptWalletChange,
    connector,
    deactivate: disconnectFromWallet,
    isUnsupportedChainId,
  };
};
