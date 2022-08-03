import { createReducer } from '@reduxjs/toolkit';
import { getVersionUpgrade, VersionUpgrade } from '@uniswap/token-lists';
import { TokenList } from '@uniswap/token-lists/dist/types';

import {
  DEFAULT_ACTIVE_LIST_URLS,
  DEFAULT_LIST_OF_LISTS,
  UNSUPPORTED_LIST_URLS,
} from '../../constants/lists';
import { updateVersion } from '../global/actions';
import {
  acceptListUpdate,
  addList,
  disableList,
  enableList,
  fetchTokenList,
  removeList,
} from './actions';

export interface ListsState {
  readonly byUrl: {
    readonly [url: string]: {
      readonly current: TokenList | null;
      readonly pendingUpdate: TokenList | null;
      readonly loadingRequestId: string | null;
      readonly error: string | null;
    };
  };
  // this contains the default list of lists from the last time the updateVersion was called, i.e. the app was reloaded
  readonly lastInitializedDefaultListOfLists?: string[];

  // currently networkLogos lists
  readonly activeListUrls: string[] | undefined;
}

type ListState = ListsState['byUrl'][string];

const NEW_LIST_STATE: ListState = {
  current: null,
  error: null,
  loadingRequestId: null,
  pendingUpdate: null,
};

type Mutable<T> = {
  -readonly [P in keyof T]: T[P] extends ReadonlyArray<infer U> ? U[] : T[P];
};

const initialState: ListsState = {
  activeListUrls: DEFAULT_ACTIVE_LIST_URLS,
  byUrl: {
    ...DEFAULT_LIST_OF_LISTS.concat(UNSUPPORTED_LIST_URLS).reduce<
      Mutable<ListsState['byUrl']>
    >((memo, listUrl) => {
      memo[listUrl] = NEW_LIST_STATE;
      return memo;
    }, {}),
  },
  lastInitializedDefaultListOfLists: DEFAULT_LIST_OF_LISTS,
};

export default createReducer(initialState, (builder) =>
  builder
    .addCase(
      fetchTokenList.pending,
      (state, { payload: { requestId, url } }) => {
        state.byUrl[url] = {
          ...state.byUrl[url],
          current: null,
          error: null,
          loadingRequestId: requestId,
          pendingUpdate: null,
        };
      }
    )
    .addCase(
      fetchTokenList.fulfilled,
      (state, { payload: { requestId, tokenList, url } }) => {
        const current = state.byUrl[url]?.current;
        const loadingRequestId = state.byUrl[url]?.loadingRequestId;

        // no-op if update does nothing
        if (current) {
          const upgradeType = getVersionUpgrade(
            current.version,
            tokenList.version
          );

          if (upgradeType === VersionUpgrade.NONE) return;
          if (loadingRequestId === null || loadingRequestId === requestId) {
            state.byUrl[url] = {
              ...state.byUrl[url],
              current: current,
              error: null,
              loadingRequestId: null,
              pendingUpdate: tokenList,
            };
          }
        } else {
          // activate if on default networkLogos
          if (DEFAULT_ACTIVE_LIST_URLS.includes(url)) {
            state.activeListUrls?.push(url);
          }

          state.byUrl[url] = {
            ...state.byUrl[url],
            current: tokenList,
            error: null,
            loadingRequestId: null,
            pendingUpdate: null,
          };
        }
      }
    )
    .addCase(
      fetchTokenList.rejected,
      (state, { payload: { errorMessage, requestId, url } }) => {
        if (state.byUrl[url]?.loadingRequestId !== requestId) {
          // no-op since it's not the latest request
          return;
        }

        state.byUrl[url] = {
          ...state.byUrl[url],
          current: null,
          error: errorMessage,
          loadingRequestId: null,
          pendingUpdate: null,
        };
      }
    )
    .addCase(addList, (state, { payload: url }) => {
      if (!state.byUrl[url]) {
        state.byUrl[url] = NEW_LIST_STATE;
      }
    })
    .addCase(removeList, (state, { payload: url }) => {
      if (state.byUrl[url]) {
        delete state.byUrl[url];
      }
      // remove list from networkLogos urls if needed
      if (state.activeListUrls && state.activeListUrls.includes(url)) {
        state.activeListUrls = state.activeListUrls.filter((u) => u !== url);
      }
    })
    .addCase(enableList, (state, { payload: url }) => {
      if (!state.byUrl[url]) {
        state.byUrl[url] = NEW_LIST_STATE;
      }

      if (state.activeListUrls && !state.activeListUrls.includes(url)) {
        state.activeListUrls.push(url);
      }

      if (!state.activeListUrls) {
        state.activeListUrls = [url];
      }
    })
    .addCase(disableList, (state, { payload: url }) => {
      if (state.activeListUrls && state.activeListUrls.includes(url)) {
        state.activeListUrls = state.activeListUrls.filter((u) => u !== url);
      }
    })
    .addCase(acceptListUpdate, (state, { payload: url }) => {
      if (!state.byUrl[url]?.pendingUpdate) {
        throw new Error('accept list update called without pending update');
      }
      state.byUrl[url] = {
        ...state.byUrl[url],
        current: state.byUrl[url].pendingUpdate,
        pendingUpdate: null,
      };
    })
    .addCase(updateVersion, (state) => {
      // state loaded from localStorage, but new lists have never been initialized
      if (!state.lastInitializedDefaultListOfLists) {
        state.byUrl = initialState.byUrl;
        state.activeListUrls = initialState.activeListUrls;
      } else if (state.lastInitializedDefaultListOfLists) {
        const lastInitializedSet =
          state.lastInitializedDefaultListOfLists.reduce<Set<string>>(
            (s, l) => s.add(l),
            new Set()
          );
        const newListOfListsSet = DEFAULT_LIST_OF_LISTS.reduce<Set<string>>(
          (s, l) => s.add(l),
          new Set()
        );

        DEFAULT_LIST_OF_LISTS.forEach((listUrl) => {
          if (!lastInitializedSet.has(listUrl)) {
            state.byUrl[listUrl] = NEW_LIST_STATE;
          }
        });

        state.lastInitializedDefaultListOfLists.forEach((listUrl) => {
          if (!newListOfListsSet.has(listUrl)) {
            delete state.byUrl[listUrl];
          }
        });
      }

      state.lastInitializedDefaultListOfLists = DEFAULT_LIST_OF_LISTS;

      // if no networkLogos lists, activate defaults
      if (!state.activeListUrls) {
        state.activeListUrls = DEFAULT_ACTIVE_LIST_URLS;

        // for each list on default list, initialize if needed
        DEFAULT_ACTIVE_LIST_URLS.map((listUrl: string) => {
          if (!state.byUrl[listUrl]) {
            state.byUrl[listUrl] = NEW_LIST_STATE;
          }
          return true;
        });
      }
    })
);