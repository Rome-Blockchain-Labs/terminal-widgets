import { ExchangeName, NetworkName } from '@rbl/velox-common/multiChains';
import { combineReducers, configureStore, createStore } from '@reduxjs/toolkit';
import { load, save } from 'redux-localstorage-simple';

import application from './application/reducer';
import burn from './burn/reducer';
import { updateVersion } from './global/actions';
import lists, { createListsReducerByExchange } from './lists/reducer';
import mint from './mint/reducer';
import multicall from './multicall/reducer';
import swap from './swap/reducer';
import transactions from './transactions/reducer';
import user from './user/reducer';

const PERSISTED_KEYS: string[] = ['user', 'transactions', 'lists'];

/** The enclosed code is only used for below **/
export const reducer = combineReducers({
  application,
  burn,
  lists,
  mint,
  multicall,
  swap,
  transactions,
  user,
});

const store = createStore(reducer);
export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
/** The enclosed code is only used for types above **/

const getExchangeReducer = (exchange: ExchangeName, network: NetworkName) => {
  const lists = createListsReducerByExchange(exchange, network);
  return combineReducers({
    application,
    burn,
    lists,
    mint,
    multicall,
    swap,
    transactions,
    user,
  });
};

const createExchangeStore = (
  namespace: string,
  exchange: ExchangeName,
  network: NetworkName
) => {
  return configureStore({
    middleware: (defaultMiddleware) => [
      ...defaultMiddleware({ thunk: false }),
      save({ namespace: namespace, states: PERSISTED_KEYS }),
    ],
    preloadedState: load({
      disableWarnings: true,
      namespace: namespace,
      states: PERSISTED_KEYS,
    }),
    reducer: getExchangeReducer(exchange, network),
  });
};

const storeList = new Map<string, any>();

export const getStore = (
  id: string,
  exchange: ExchangeName,
  network: NetworkName
) => {
  if (storeList.has(id)) {
    const store = storeList.get(id);
    store.dispatch(updateVersion());

    return store;
  }

  const store = createExchangeStore(id, exchange, network);
  storeList.set(id, store);

  return store;
};

export const removeStore = (id: string) => {
  storeList.delete(id);
};
