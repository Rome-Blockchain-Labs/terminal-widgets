import { useWeb3React } from '@romeblockchain/wallet';
import {
  getVersionUpgrade,
  minVersionBump,
  VersionUpgrade,
} from '@uniswap/token-lists';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useInterval, useIsWindowVisible } from '../../../../hooks';
import { useFetchListCallback } from '../../hooks/useFetchListCallback';
import { AppDispatch, AppState } from '..';
import { addPopup } from '../application/actions';
import { acceptListUpdate } from './actions';

export default function Updater(): null {
  const { provider: library } = useWeb3React();
  const dispatch = useDispatch<AppDispatch>();
  const lists = useSelector<AppState, AppState['lists']['byUrl']>(
    (state) => state.lists.byUrl
  );

  const isWindowVisible = useIsWindowVisible();

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
  useInterval(fetchAllListsCallback, library ? 1000 * 60 * 10 : null);

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
  }, [dispatch, fetchList, library, lists]);

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
            const min = minVersionBump(
              list.current.tokens,
              list.pendingUpdate.tokens
            );
            // automatically update minor/patch as long as bump matches the min update
            if (bump >= min) {
              dispatch(acceptListUpdate(listUrl));
              dispatch(
                addPopup({
                  content: {
                    listUpdate: {
                      auto: true,
                      listUrl,
                      newList: list.pendingUpdate,
                      oldList: list.current,
                    },
                  },
                  key: listUrl,
                })
              );
            } else {
              console.error(
                `List at url ${listUrl} could not automatically update because the version bump was only PATCH/MINOR while the update had breaking changes and should have been MAJOR`
              );
            }
            break;

          case VersionUpgrade.MAJOR:
            dispatch(
              addPopup({
                content: {
                  listUpdate: {
                    auto: false,
                    listUrl,
                    newList: list.pendingUpdate,
                    oldList: list.current,
                  },
                },
                key: listUrl,
                removeAfterMs: null,
              })
            );
        }
      }
    });
  }, [dispatch, lists]);

  return null;
}