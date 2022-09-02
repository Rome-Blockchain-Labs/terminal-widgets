import { combineReducers } from '@reduxjs/toolkit';

import DmmReducer from '../../dapps/dmm/state';

const reducer = combineReducers({
  dmm: DmmReducer,
});
export default reducer;
