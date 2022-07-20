import { ExchangeName, NetworkName } from '@rbl/velox-common/multiChains';
import { ActionReducerMapBuilder, createReducer } from '@reduxjs/toolkit';
import { getVersionUpgrade, VersionUpgrade } from '@uniswap/token-lists';
import { TokenList } from '@uniswap/token-lists/dist/types';

import { getTokenListUrlsByExchangeName } from '../../token-list';
import { updateVersion } from '../global/actions';
import {
  acceptListUpdate,
  addList,
  fetchTokenList,
  removeList,
  selectList,
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
  readonly selectedListUrl: string | undefined;
}

const NEW_LIST_STATE: ListsState['byUrl'][string] = {
  current: null,
  error: null,
  loadingRequestId: null,
  pendingUpdate: null,
};

type Mutable<T> = {
  -readonly [P in keyof T]: T[P] extends ReadonlyArray<infer U> ? U[] : T[P];
};
/** The enclosed code is only used for types below **/
const initialState: ListsState = {
  byUrl: {},
  selectedListUrl: undefined,
};

const builderCallback = (builder: ActionReducerMapBuilder<ListsState>) =>
  builder
    .addCase(
      fetchTokenList.pending,
      (state, { payload: { requestId, url } }) => {}
    )
    .addCase(
      fetchTokenList.fulfilled,
      (state, { payload: { requestId, tokenList, url } }) => {}
    )
    .addCase(
      fetchTokenList.rejected,
      (state, { payload: { errorMessage, requestId, url } }) => {}
    )
    .addCase(selectList, (state, { payload: url }) => {})
    .addCase(addList, (state, { payload: url }) => {})
    .addCase(removeList, (state, { payload: url }) => {})
    .addCase(acceptListUpdate, (state, { payload: url }) => {})
    .addCase(updateVersion, (state) => {});

export default createReducer(initialState, builderCallback);
/** The enclosed code is only used for types above **/
// DEFAULT_LIST_OF_LISTS by exchange
export const createListsReducerByExchange = (
  exchange: ExchangeName,
  network: NetworkName
) => {
  const defaultListOfLists = getTokenListUrlsByExchangeName(exchange, network);
  const initialState: ListsState = {
    byUrl: {
      ...defaultListOfLists.reduce<Mutable<ListsState['byUrl']>>(
        (memo, listUrl) => {
          memo[listUrl] = NEW_LIST_STATE;
          return memo;
        },
        {}
      ),
    },
    lastInitializedDefaultListOfLists: defaultListOfLists,
    selectedListUrl: undefined,
  };

  const builderCallback = (builder: ActionReducerMapBuilder<ListsState>) =>
    builder
      .addCase(
        fetchTokenList.pending,
        (state, { payload: { requestId, url } }) => {
          state.byUrl[url] = {
            ...state.byUrl[url],
            error: null,
            loadingRequestId: requestId,
          };
        }
      )
      .addCase(
        fetchTokenList.fulfilled,
        (state, { payload: { requestId, tokenList, url } }) => {
          const current = state.byUrl[url]?.current;
          const loadingRequestId = state.byUrl[url]?.loadingRequestId;

          //reject the token list if it is empty
          if (!tokenList.tokens.length) {
            state.byUrl[url] = {
              ...state.byUrl[url],
              current: null,
              error: 'No tokens returned in list',
              loadingRequestId: null,
              pendingUpdate: null,
            };
            return;
          }

          //we don't want to include metis twice, as it is both the native token and an ERC20 token
          const tokenListWithoutERC20Metis = tokenList.tokens.filter((a) => {
            return (
              a.address.toLowerCase() !==
              '0xdeaddeaddeaddeaddeaddeaddeaddeaddead0000'
            ); //.toLowerCase()
          });
          (tokenList.tokens as any) = tokenListWithoutERC20Metis;

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
      .addCase(selectList, (state, { payload: url }) => {
        state.selectedListUrl = url;
        // automatically adds list
        if (!state.byUrl[url]) {
          state.byUrl[url] = NEW_LIST_STATE;
        }
      })
      .addCase(addList, (state, { payload: url }) => {
        if (!state.byUrl[url]) {
          state.byUrl[url] = NEW_LIST_STATE;
        }
      })
      .addCase(removeList, (state, { payload: url }) => {
        if (state.byUrl[url]) {
          delete state.byUrl[url];
        }
        if (state.selectedListUrl === url) {
          state.selectedListUrl = Object.keys(state.byUrl)[0];
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
          state.selectedListUrl = undefined;
        } else if (state.lastInitializedDefaultListOfLists) {
          const lastInitializedSet =
            state.lastInitializedDefaultListOfLists.reduce<Set<string>>(
              (s, l) => s.add(l),
              new Set()
            );
          const newListOfListsSet = defaultListOfLists.reduce<Set<string>>(
            (s, l) => s.add(l),
            new Set()
          );

          defaultListOfLists.forEach((listUrl) => {
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

        state.lastInitializedDefaultListOfLists = defaultListOfLists;
      });

  return createReducer(initialState, builderCallback);
};
