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
    const { account, isActive: active, provider } = useWeb3React();

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
