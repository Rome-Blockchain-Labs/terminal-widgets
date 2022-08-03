import { useWallets,useWeb3React } from '@romeblockchain/wallet';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import {WalletConnector} from '../../../components/WalletConnector';
import { getWalletBalance } from '../../../redux/wallet/walletSlice';
import {useWalletsSelection} from '../../../utils/web3/walletSelectionContext';
import MustConnect from '../../components/MustConnect';

const withHeaderAndSigner = (WrappedComponent) => {
  return (props) => {
    const dispatch = useDispatch();
    const { account, active, provider, setSelectedWallet } = useWallets();
    console.log(account, setSelectedWallet)
    const { selectingNetwork } = useWalletsSelection()

    useEffect(() => {
      if (active && provider) {
        dispatch(getWalletBalance({ provider }));
      }
    }, [active, dispatch, provider]);

    if (selectingNetwork){
      //todo
      return <>Put modal here to select specific wallet</>
    }

    if (!active) {
      return <>
        <MustConnect text={'You must connect your wallet'} />
        <WalletConnector/>
        </>;
    }
    if (!account) {
      return (
        <>
          <MustConnect
            text={'In order to trade, you must have an account in your wallet'}
          />
          <WalletConnector/>
        </>

      );
    }
    return <WrappedComponent {...props} />;
  };
};

export default withHeaderAndSigner;
