import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { useWallets } from '../../../../../contexts/WalletsContext/WalletContext';
import { updateConnection } from '../../redux/wallet/walletSlice';

export const useEthereumInactiveListener = (
  chainChangedCallback: Function | null,
  accountsChangedCallback: Function | null
) => {
  const { active, chainId, connector } = useWallets();

  const { ethereum } = window as any;

  const dispatch = useDispatch();

  useEffect((): any => {
    // chainhex is compared with chainid in step1selectexchange.jsx
    // if they are not equal then user cannot proceed to the next step
    // adding if(chainId) makes sure that we always update chainhex to the latest chainid
    // the user is connected to
    if (chainId) {
      dispatch(updateConnection({ chainHex: chainId }));
    }
  }, [dispatch, chainId]);

  useEffect((): any => {
    if (ethereum && ethereum.on && !active) {
      ethereum.on('chainChanged', () => {
        if (chainChangedCallback) {
          return chainChangedCallback();
        }

        window.location.reload();
      });
      ethereum.on('accountsChanged', () => {
        if (accountsChangedCallback) {
          return accountsChangedCallback();
        }

        window.location.reload();
      });

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('chainChanged', () => {
            if (chainChangedCallback) {
              return chainChangedCallback();
            }

            window.location.reload();
          });
          ethereum.removeListener('accountsChanged', () => {
            if (accountsChangedCallback) {
              return accountsChangedCallback();
            }

            window.location.reload();
          });
        }
      };
    }
  }, [
    active,
    connector,
    ethereum,
    chainChangedCallback,
    accountsChangedCallback,
  ]);
};
