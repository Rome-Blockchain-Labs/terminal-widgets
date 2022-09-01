import { combineReducers } from '@reduxjs/toolkit';

import application from './application/reducer';
import burn from './burn/reducer';
import farms from './farms/reducer';
import lists from './lists/reducer';
import mint from './mint/reducer';
import multicall from './multicall/reducer';
import pair from './pair/reducer';
import pools from './pools/reducer';
import swap from './swap/reducer';
import transactions from './transactions/reducer';
import user from './user/reducer';
import vesting from './vesting/reducer';

const reducer = combineReducers({
  application,
  burn,
  farms,
  lists,
  mint,
  multicall,
  pair,
  pools,
  swap,
  transactions,
  user,
  vesting,
});

export default reducer;
