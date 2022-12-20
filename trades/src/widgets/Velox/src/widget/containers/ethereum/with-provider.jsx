import { RomeEventType, widgetBridge } from '@romeblockchain/bridge';
import { useWeb3React } from '@romeblockchain/wallet';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import WalletModal from '../../../components/WalletModal';
import {
  getWalletBalance,
  updateConnection,
} from '../../../redux/wallet/walletSlice';
const withHeaderAndSigner = (WrappedComponent) => {
  return (props) => {
    const dispatch = useDispatch();

    const { account, connector, isActive: active, provider } = useWeb3React();

    useEffect(() => {
      const disconnectFromWallet = () => {
        if (connector.deactivate) {
          connector.deactivate();
        } else {
          connector.resetState();
        }
      };
      widgetBridge.subscribe(
        RomeEventType.WIDGET_WALLET_DISCONNECT_EVENT,
        () => {
          disconnectFromWallet();
        }
      );
    }, [connector]);

    useEffect(() => {
      if (account && active && provider) {
        dispatch(updateConnection({ account, connected: active }));
        dispatch(getWalletBalance({ provider }));
      }
    }, [account, active, dispatch, provider]);

    if (!account) {
      return <WalletModal />;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withHeaderAndSigner;
