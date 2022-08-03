import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import MustConnect from '../../components/MustConnect';
import WalletModal from '../../components/WalletModal';
import { getWalletBalance } from '../../redux/wallet/walletSlice';
import { useWeb3Provider } from '../../utils/web3';

const withHeaderAndSigner = (WrappedComponent) => {
  return (props) => {
    const dispatch = useDispatch();
    const { account, isActive: active, provider } = useWeb3Provider();

    useEffect(() => {
      if (active && provider) {
        dispatch(getWalletBalance({ provider }));
      }
    }, [active, dispatch, provider]);
    console.log(account, provider);
    if (!account) {
      return <WalletModal />;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withHeaderAndSigner;
