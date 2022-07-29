import { ChainId } from '@dynamic-amm/sdk';
import { nanoid } from '@reduxjs/toolkit';
import { TokenList } from '@uniswap/token-lists';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { useWallets } from '../../../contexts/WalletsContext/WalletContext';
import { AppDispatch } from '../../../store';
import { fetchTokenList } from '../state/lists/actions';
import getTokenList from '../utils/getTokenList';
import resolveENSContentHash from '../utils/resolveENSContentHash';

export function useFetchListCallback(): (
  listUrl: string,
  sendDispatch?: boolean
) => Promise<TokenList> {
  const { chainId, provider } = useWallets();
  const dispatch = useDispatch<AppDispatch>();

  const ensResolver = useCallback(
    (ensName: string) => {
      if (!provider || chainId !== ChainId.MAINNET) {
        throw new Error('Could not construct mainnet ENS resolver');
      }
      return resolveENSContentHash(ensName, provider);
    },
    [chainId, provider]
  );

  // note: prevent dispatch if using for list search or unsupported list
  return useCallback(
    async (listUrl: string, sendDispatch = true) => {
      const requestId = nanoid();
      sendDispatch &&
        dispatch(fetchTokenList.pending({ requestId, url: listUrl }));
      return getTokenList(listUrl, ensResolver)
        .then((tokenList) => {
          sendDispatch &&
            dispatch(
              fetchTokenList.fulfilled({ requestId, tokenList, url: listUrl })
            );
          return tokenList;
        })
        .catch((error) => {
          console.debug(`Failed to get list at url ${listUrl}`, error);
          sendDispatch &&
            dispatch(
              fetchTokenList.rejected({
                errorMessage: error.message,
                requestId,
                url: listUrl,
              })
            );
          throw error;
        });
    },
    [dispatch, ensResolver]
  );
}
