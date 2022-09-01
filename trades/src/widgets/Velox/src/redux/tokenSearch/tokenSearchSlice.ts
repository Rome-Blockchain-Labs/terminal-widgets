import { NETWORKS } from '@rbl/velox-common/multiChains';
import TradeEstimatorEthMainnetUniV2 from '@rbl/velox-common/shared/tradeEstimators/UniV2ClonesTradeEstimator';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import retry from 'async-retry';
import { stringify } from 'flatted';

import { TokenSearchState } from '../../model/store/token-search';
import {
  searchTokenByPairAddressAsync,
  searchTokensAsync,
} from '../../services/proxy.service';
import loggerWithCloud from '../../utils/logging/loggerWithCloud';
import { updateTokenBalance } from '../quotas/quotasSlice';
import { PROVIDER_DISCONNECT } from '../sharedActions';

// thunks
export const fetchAndSetTokenPair = createAsyncThunk(
  'token/searchSetPair',
  async ({ pairAddress, provider }: any, thunkAPI: any) => {
    try {
      const { strategy } = thunkAPI.getState().velox;
      const selectedPair = await searchTokenByPairAddressAsync(
        pairAddress,
        strategy.selectedExchange
      );
      thunkAPI.dispatch(setPair({ provider, selectedPair }));
    } catch (err) {
      loggerWithCloud.log(
        `Something went wrong pre-loading token pair. Please select manually, err:${stringify(
          err,
          Object.getOwnPropertyNames(err)
        )}`
      );
      return;
    }
  }
);

export const setPair = createAsyncThunk(
  'token/setPair',
  async ({ provider, selectedPair }: any, thunkAPI: any) => {
    const { selectedExchange } = thunkAPI.getState().velox.strategy;
    thunkAPI.dispatch(
      updateTokenBalance({ provider, token: selectedPair.token0 })
    );
    thunkAPI.dispatch(
      updateTokenBalance({ provider, token: selectedPair.token1 })
    );
    thunkAPI.dispatch(
      getPairReserves({ provider, selectedExchange, selectedPair })
    );
    return selectedPair;
  }
);
const getPairReserves = createAsyncThunk(
  'tokens/pairTradeEstimate',
  async (payload: any) => {
    const { provider, selectedExchange, selectedPair } = payload;

    //todo use velox-common/uniV2ClonesSDK/constants
    let chainId, factoryAddress, pairCodeHash;
    switch (selectedExchange.identifiers.exchange) {
      case NETWORKS.ETHEREUM.MAINNET.UNISWAPV2.NAME:
        chainId = 1;
        factoryAddress = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';
        pairCodeHash =
          '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f';
        break;
      case NETWORKS.ETHEREUM.MAINNET.SUSHISWAP.NAME:
        chainId = 1;
        factoryAddress = '0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac';
        pairCodeHash =
          '0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303';
        break;
      case NETWORKS.AVALANCHE.MAINNET.PANGOLIN.NAME:
        chainId = 43114;
        factoryAddress = '0xefa94de7a4656d787667c749f7e1223d71e9fd88';
        pairCodeHash =
          '0x40231f6b438bce0797c9ada29b718a87ea0a5cea3fe9a771abdd76bd41a3e545';
        break;
      case NETWORKS.AVALANCHE.MAINNET.TRADERJOE.NAME:
        chainId = 43114;
        factoryAddress = '0x9Ad6C38BE94206cA50bb0d90783181662f0Cfa10';
        pairCodeHash =
          '0x0bbca9af0511ad1a1da383135cf3a8d2ac620e549ef9f6ae3a4c33c2fed0af91';
        break;
      case NETWORKS.BSC.MAINNET.PANCAKESWAP.NAME:
        chainId = 56;
        factoryAddress = '0xca143ce32fe78f1f7019d7d551a6402fc5350c73';
        pairCodeHash =
          '0x00fb7f630766e6a796048ea87d01acd3068e8ff67d078148a3fa3f4a84f69bd5';
        break;
      default:
        throw new Error('Trade estimation failed');
    }
    const tradeEstimator = await TradeEstimatorEthMainnetUniV2.createFromTokens(
      provider,
      chainId,
      selectedPair.token0.address,
      selectedPair.token1.address,
      selectedPair.token0.decimals,
      selectedPair.token1.decimals,
      factoryAddress,
      pairCodeHash
    );
    return tradeEstimator.serialize();
  }
);

export const resetSearchOnNewExchange = createAsyncThunk(
  'token/searchReset',
  async (searchString: string, thunkAPI: any) => {
    thunkAPI.dispatch(searchTokenPairs(''));
  }
);

const setPairSearchTimestamp = createAsyncThunk(
  'token/saveTime',
  async (timestamp: number) => {
    return timestamp;
  }
);

export const searchTokenPairs = createAsyncThunk(
  'token/search',
  async (searchString: string, thunkAPI: any) => {
    try {
      const { strategy } = thunkAPI.getState().velox;
      const pairSearchTimestamp = new Date().getTime();
      thunkAPI.dispatch(setPairSearchTimestamp(pairSearchTimestamp));
      const data = await retry(
        () => searchTokensAsync(searchString, strategy.selectedExchange),
        { retries: 1 }
      );
      return { data, pairSearchTimestamp };
    } catch (e) {
      throw new Error(stringify(e, Object.getOwnPropertyNames(e)));
    }
  }
);

const initialTimestamp = new Date().getTime();
const initialState: TokenSearchState = {
  fetchError: null,
  isLoading: true,
  isSelecting: false,
  pairSearchTimestamp: initialTimestamp,
  searchText: '',
  selectedPair: undefined,
  serializedTradeEstimator: '',
  suggestions: [],
};

export const tokenSearchSlice = createSlice({
  extraReducers: (builder) => {
    builder.addCase(resetSearchOnNewExchange.fulfilled, (state, action) => {
      state.searchText = '';
      state.suggestions = [];
      state.isLoading = true;
      state.fetchError = null;
      state.isSelecting = false;
      state.selectedPair = undefined;
      // don't update pairSearchTimestamp
      state.serializedTradeEstimator = '';
    });
    builder.addCase(setPairSearchTimestamp.fulfilled, (state, action) => {
      state.pairSearchTimestamp = action.payload;
    });
    builder.addCase(PROVIDER_DISCONNECT, (state) => {
      state.selectedPair = undefined;
      state.isLoading = true;
      state.searchText = '';
    });
    builder.addCase(getPairReserves.fulfilled, (state, action) => {
      state.serializedTradeEstimator = action.payload;
    });
    builder.addCase(setPair.fulfilled, (state, action) => {
      //pending/rejected not needed as its not really async
      state.searchText = '';
      state.isSelecting = false;
      state.selectedPair = action.payload;
    });
    builder.addCase(fetchAndSetTokenPair.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(fetchAndSetTokenPair.rejected, (state, action) => {
      loggerWithCloud.sendToCloud(
        `fetchAndSetTokenPair error:${stringify(action)}`,
        'error'
      );
      state.isLoading = false;
    });
    builder.addCase(searchTokenPairs.pending, (state) => {
      // state.isLoading = true
      state.fetchError = null;
    });
    builder.addCase(searchTokenPairs.fulfilled, (state, action) => {
      if (action.payload.pairSearchTimestamp >= state.pairSearchTimestamp) {
        state.pairSearchTimestamp = action.payload.pairSearchTimestamp;
        state.suggestions = action.payload.data;
        state.isLoading = false;
        state.fetchError = null;
      }
    });
    builder.addCase(searchTokenPairs.rejected, (state, action) => {
      loggerWithCloud.sendToCloud(
        `searchTokenPairs error:${stringify(action)}`,
        'error'
      );
      state.suggestions = [];
      state.isLoading = false;
      state.fetchError = 'Something went wrong fetching token pair.'; //action.error.message
    });
  },
  initialState,
  name: 'tokenSearch',
  reducers: {
    setSearchText: (state, action) => {
      state.searchText = action.payload;
    },
    startSelecting: (state) => {
      state.isSelecting = true;
    },
    stopSelecting: (state) => {
      state.isSelecting = false;
    },
    toggleSelecting: (state) => {
      state.isSelecting = !state.isSelecting;
    },
    // setPair: (state, action) => {
    //   state.searchText = ""
    //   state.isSelecting = false
    //   state.selectedPair = action.payload
    // },
  },
});

export const { setSearchText, startSelecting, stopSelecting, toggleSelecting } =
  tokenSearchSlice.actions;
export default tokenSearchSlice.reducer;
