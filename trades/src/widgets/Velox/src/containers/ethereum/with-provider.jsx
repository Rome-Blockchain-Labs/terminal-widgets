import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import MustConnect from '../../components/MustConnect';
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

    if (!active) {
      return <MustConnect text={'You must connect your wallet'} />;
    }
    if (!account) {
      return (
        <MustConnect
          text={'In order to trade, you must have an account in your wallet'}
        />
      );
    }
    return <WrappedComponent {...props} />;
  };
};

export default withHeaderAndSigner;
