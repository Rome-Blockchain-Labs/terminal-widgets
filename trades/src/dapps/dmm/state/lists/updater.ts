import { useWeb3React } from '@romeblockchain/wallet';
import { getVersionUpgrade, VersionUpgrade } from '@uniswap/token-lists';
import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { AppDispatch } from '../../../../store';
import { UNSUPPORTED_LIST_URLS } from '../../constants/lists';
import { useFetchListCallback } from '../../hooks/useFetchListCallback';
import useInterval from '../../hooks/useInterval';
import useIsWindowVisible from '../../hooks/useIsWindowVisible';
import { useAllLists } from '../lists/hooks';
import { acceptListUpdate } from './actions';
import { useActiveListUrls } from './hooks';

export default function Updater(): null {
  const { provider } = useWeb3React();
  const dispatch = useDispatch<AppDispatch>();
  const isWindowVisible = useIsWindowVisible();

  // get all loaded lists, and the networkLogos urls
  const lists = useAllLists();
  const activeListUrls = useActiveListUrls();

  const fetchList = useFetchListCallback();
  const fetchAllListsCallback = useCallback(() => {
    if (!isWindowVisible) return;
    Object.keys(lists).forEach((url) =>
      fetchList(url).catch((error) =>
        console.debug('interval list fetching error', error)
      )
    );
  }, [fetchList, isWindowVisible, lists]);

  // fetch all lists every 10 minutes, but only after we initialize library
  useInterval(fetchAllListsCallback, provider ? 1000 * 60 * 10 : null);

  // whenever a list is not loaded and not loading, try again to load it
  useEffect(() => {
    Object.keys(lists).forEach((listUrl) => {
      const list = lists[listUrl];
      if (!list.current && !list.loadingRequestId && !list.error) {
        fetchList(listUrl).catch((error) =>
          console.debug('list added fetching error', error)
        );
      }
    });
  }, [dispatch, fetchList, provider, lists]);

  // if any lists from unsupported lists are loaded, check them too (in case new updates since last visit)
  useEffect(() => {
    UNSUPPORTED_LIST_URLS.forEach((listUrl) => {
      const list = lists[listUrl];
      if (!list || (!list.current && !list.loadingRequestId && !list.error)) {
        fetchList(listUrl).catch((error) =>
          console.debug('list added fetching error', error)
        );
      }
    });
  }, [dispatch, fetchList, lists]);

  // automatically update lists if versions are minor/patch
  useEffect(() => {
    Object.keys(lists).forEach((listUrl) => {
      const list = lists[listUrl];

      if (list.current && list.pendingUpdate) {
        const bump = getVersionUpgrade(
          list.current.version,
          list.pendingUpdate.version
        );
        switch (bump) {
          case VersionUpgrade.NONE:
            throw new Error('unexpected no version bump');
          case VersionUpgrade.PATCH:
          case VersionUpgrade.MINOR:
          case VersionUpgrade.MAJOR:
            dispatch(acceptListUpdate(listUrl));
        }
      }
    });
  }, [dispatch, lists, activeListUrls]);

  return null;
}
