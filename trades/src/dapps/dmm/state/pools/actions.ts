import { Pair } from '@dynamic-amm/sdk';
import { createAction } from '@reduxjs/toolkit';

import { SubgraphPoolData, UserLiquidityPosition } from './hooks';

export const updatePools = createAction<{ pools: SubgraphPoolData[] }>(
  'dmm/pools/updatePools'
);
export const setLoading = createAction<boolean>('dmm/pools/setLoading');
export const setError = createAction<Error | undefined>('dmm/pools/setError');
export const setSelectedPool = createAction<{
  pool: Pair;
  subgraphPoolData: SubgraphPoolData;
  myLiquidity?: UserLiquidityPosition;
}>('dmm/pools/setSelectedPool');
