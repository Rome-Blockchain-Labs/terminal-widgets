import { useWallets, useWeb3React } from '@romeblockchain/wallet';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { NetworkName } from '../../../../../constants/networkExchange';
import { enableVeloxWidgetMode } from '../../config';
import { SUPPORTED_CHAIN_IDS } from '../../constants';
import { updateConnection } from '../../redux/wallet/walletSlice';
import { useSwitchNetwork } from './useSwitchNetwork';
import { getDefaultNetworkName } from './util';
import { useWalletsSelection } from './walletSelectionContext';

export const useWeb3Provider = (): any => {
  const dispatch = useDispatch();
  const { setSelectedWallet, ...restParams } = useWallets();
  const { toggleSelectingNetwork } = useWalletsSelection();
  const { account, chainId, connector, isActive } = useWeb3React();

  const disconnectFromWallet = (
    networkName: any /**todo NetworkName from wallertContext**/
  ) => {
    // connector.deactivate() todo investigate
    if (connector.deactivate) {
      connector.deactivate();
    } else {
      connector.resetState();
    }
  };

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
    console.log('return');
    if (!account) return;
    console.log(account);

    dispatch(updateConnection({ account, chainHex: chainId, connected: true }));
  }, [account, chainId, dispatch]);

  const isUnsupportedChainId = !chainId;

  return {
    ...restParams,
    account,
    activate: toggleSelectingNetwork,
    active: isActive && account,
    connector,
    deactivate: disconnectFromWallet,
    isUnsupportedChainId,
  };
};
