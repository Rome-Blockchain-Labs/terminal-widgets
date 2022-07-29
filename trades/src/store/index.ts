import { configureStore } from '@reduxjs/toolkit';
import { save } from 'redux-localstorage-simple';

//TODO: uncomment for dmm, benqi
import tokens from '../dapps/benqi/store/services/api/tokens';
import blockchain from '../dapps/benqi/store/services/benqi/benqi';
// import { migrateLocalStorage } from '../migrations';
import { veloxReducers } from '../widgets/Velox/src/store/store';
import DappsReducer from './reducers/dapps';
// import DappsReducer from './reducers/dapps';
import AppSlice from './slices/app';

const PERSISTED_KEYS: string[] = ['user', 'transactions', 'lists', 'app'];

const store = configureStore({
  middleware: (defaultMiddleware) => [
    ...defaultMiddleware({
      serializableCheck: false,
      thunk: true,
    }),
    save({ states: PERSISTED_KEYS }),
    blockchain.middleware,
  ],
  // preloadedState: migrateLocalStorage(load({ states: PERSISTED_KEYS })),
  reducer: {
    app: AppSlice.reducer,
    dapps: DappsReducer,
    // dapps: DappsReducer,
    velox: veloxReducers,
    [blockchain.reducerPath]: blockchain.reducer,
    [tokens.reducerPath]: tokens.reducer,
  },
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
