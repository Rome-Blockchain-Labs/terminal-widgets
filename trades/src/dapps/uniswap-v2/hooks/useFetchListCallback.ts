import { nanoid } from '@reduxjs/toolkit';
import { TokenList } from '@uniswap/token-lists';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { useWallets } from '../../../contexts/WalletsContext/WalletContext';
import { AppDispatch } from '../../../store';
import { resolveENSContentHash } from '../../../utils';
import { fetchTokenList } from '../state/lists/actions';
import getTokenList from '../utils/getTokenList';

export function useFetchListCallback(): (
  listUrl: string
) => Promise<TokenList> {
  const { provider } = useWallets();

  const dispatch = useDispatch<AppDispatch>();

  const ensResolver = useCallback(
    (ensName: string) => {
      if (!provider) throw new Error('ensResolver failed');
      return resolveENSContentHash(ensName, provider);
    },
    [provider]
  );

  return useCallback(
    async (listUrl: string) => {
      const requestId = nanoid();
      dispatch(fetchTokenList.pending({ requestId, url: listUrl }));
      return getTokenList(listUrl, ensResolver)
        .then((tokenList) => {
          dispatch(
            fetchTokenList.fulfilled({ requestId, tokenList, url: listUrl })
          );
          return tokenList;
        })
        .catch((error) => {
          console.debug(`Failed to get list at url ${listUrl}`, error);
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
