import { Pair } from '@dynamic-amm/sdk';
import { createReducer } from '@reduxjs/toolkit';

import { setError, setLoading, setSelectedPool, updatePools } from './actions';
import { SubgraphPoolData, UserLiquidityPosition } from './hooks';

interface SelectedPool {
  pool: Pair;
  subgraphPoolData: SubgraphPoolData;
  myLiquidity?: UserLiquidityPosition;
}

export interface PoolsState {
  readonly pools: SubgraphPoolData[];
  readonly loading: boolean;
  readonly error?: Error;
  readonly selectedPool?: SelectedPool;
}

const initialState: PoolsState = {
  error: undefined,
  loading: false,
  pools: [],
  selectedPool: undefined,
};

export default createReducer<PoolsState>(initialState, (builder) =>
  builder
    .addCase(updatePools, (state, { payload: { pools } }) => {
      return {
        ...state,
        pools,
        selectedPool: undefined,
      };
    })
    .addCase(setLoading, (state, { payload: loading }) => {
      return {
        ...state,
        loading,
        selectedPool: undefined,
      };
    })
    .addCase(setError, (state, { payload: error }) => {
      return {
        ...state,
        error,
        selectedPool: undefined,
      };
    })
    .addCase(
      setSelectedPool,
      (state, { payload: { myLiquidity, pool, subgraphPoolData } }) => {
        return {
          ...state,
          selectedPool: {
            myLiquidity,
            pool,
            subgraphPoolData,
          },
        };
      }
    )
);
