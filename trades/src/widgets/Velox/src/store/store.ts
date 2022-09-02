import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';

import { quotasSlice } from '../redux/quotas/quotasSlice';
import { strategySlice } from '../redux/strategy/strategySlice';
import { strategyConfigSlice } from '../redux/strategyConfig/strategyConfigSlice';
import { tokenSearchSlice } from '../redux/tokenSearch/tokenSearchSlice';
import { userFeedbackSlice } from '../redux/userFeedback/userFeedbackSlice';
import { walletSlice } from '../redux/wallet/walletSlice';

export const veloxReducers = combineReducers({
  quotas: quotasSlice.reducer,
  strategy: strategySlice.reducer,
  strategyConfig: strategyConfigSlice.reducer,
  tokenSearch: tokenSearchSlice.reducer,
  userFeedback: userFeedbackSlice.reducer,
  wallet: walletSlice.reducer,
});

const reducers = combineReducers({
  velox: veloxReducers,
});

export const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  middleware: getDefaultMiddleware({
    immutableCheck: false,
  }),
  reducer: reducers,
});
