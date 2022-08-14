import { configureStore } from '@reduxjs/toolkit';

import { veloxReducers } from '../widgets/Velox/src/store/store';
import DappsReducer from './reducers/dapps';
import AppSlice from './slices/app';

const store = configureStore({
  middleware: (defaultMiddleware) => [
    ...defaultMiddleware({
      serializableCheck: false,
      thunk: true,
    }),
  ],
  reducer: {
    app: AppSlice.reducer,
    dapps: DappsReducer,
    velox: veloxReducers,
  },
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
