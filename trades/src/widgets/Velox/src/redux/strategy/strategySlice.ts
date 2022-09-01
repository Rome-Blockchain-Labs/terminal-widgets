import { tokenHierarchyLogic } from '@rbl/velox-common';
import UniV2ClonesTradeEstimator from '@rbl/velox-common/shared/tradeEstimators/UniV2ClonesTradeEstimator';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import BN from 'bignumber.js';
import { stringify } from 'flatted';
import flatten from 'lodash/flatten';
import uniq from 'lodash/uniq';
import sha256 from 'sha256';
import * as uuid from 'uuid';

import {
  nativeToken,
  usd,
} from '../../containers/exchange/StrategyModeSelector/allowableStrategyModes';
import {
  getDefaultExchange,
  setDefaultExchange,
} from '../../containers/exchangeSelector/allowableExchanges';
import { allowableExchanges } from '../../model/model';
import { PartnerStrategyDeployed, Strategy } from '../../model/strategy';
import { Token } from '../../model/token';
import { getTokenNameDictionary } from '../../services/proxy.service';
import {
  addStrategyAsync,
  deleteStrategyAsync,
  getUserStrategiesAsync,
} from '../../services/proxy.service';
import loggerWithCloud from '../../utils/logging/loggerWithCloud';
import { PROVIDER_DISCONNECT } from '../sharedActions';
import { resetSearchOnNewExchange } from '../tokenSearch/tokenSearchSlice';
import { toastError, toastSuccess } from '../userFeedback/userFeedbackSlice';
import { recaclulateAndInjectMinMax } from './mapStrategyData';

BN.config({ EXPONENTIAL_AT: [-50, 50] });

export const isToken0Base = (
  selectedExchange: allowableExchanges,
  token0: Token,
  token1: Token
) => {
  return tokenHierarchyLogic.isToken0BaseOfPair(
    selectedExchange.identifiers.blockchain,
    selectedExchange.identifiers.chainId,
    token0.id,
    token1.id
  );
};

const tokensOutPerIn = (token0IsBase: boolean, strategyState: any) => {
  const { buyingToken0 } = strategyState;
  //if you are buying the stablecoin(baseToken), then get [UITextBox] tokensOutPerIn, otherwise its inverse
  const baseIsOutput = buyingToken0 === token0IsBase;
  const tokensOutPerIn = baseIsOutput
    ? strategyState.price
    : new BN(1).dividedBy(strategyState.price).toString();
  //priceIsUpperBound means the UI says "equal or less than"
  const stopOrder = baseIsOutput === strategyState.priceIsUpperBound;
  return {
    maxTokenOutPerTokenIn: stopOrder ? tokensOutPerIn : null,
    minTokenOutPerTokenIn: stopOrder ? null : tokensOutPerIn,
  };
};

// thunks
export const addStrategy = createAsyncThunk(
  'strategy/add',
  async (payload: any, thunkAPI: any) => {
    const { provider } = payload;
    const { strategy, tokenSearch, wallet } = thunkAPI.getState().velox;
    const { selectedExchange } = strategy;
    const { token0, token1 } = tokenSearch.selectedPair;
    try {
      const token0IsBase = isToken0Base(selectedExchange, token0, token1);
      const baseToken = token0IsBase ? token0 : token1;
      let inOutTokens;
      if (strategy.buyingToken0) {
        inOutTokens = {
          tokenInAddress: token1.id,
          tokenInAmount: new BN(strategy.token1Amount)
            .shiftedBy(token1.decimals)
            .toFixed(0, BN.ROUND_DOWN)
            .toString(),
          tokenInDecimals: token1.decimals,
          tokenOutAddress: token0.id,
          tokenOutDecimals: token0.decimals,
        };
      } else {
        inOutTokens = {
          tokenInAddress: token0.id,
          tokenInAmount: new BN(strategy.token0Amount)
            .shiftedBy(token0.decimals)
            .toFixed(0, BN.ROUND_DOWN)
            .toString(),
          tokenInDecimals: token0.decimals,
          tokenOutAddress: token1.id,
          tokenOutDecimals: token1.decimals,
        };
      }
      let priceTriggers;
      if (strategy.strategyMode === usd) {
        priceTriggers = {
          maxUsdPrice: strategy.priceIsUpperBound ? strategy.price : null,
          minUsdPrice: strategy.priceIsUpperBound ? null : strategy.price,
        };
      } else if (strategy.strategyMode === nativeToken) {
        priceTriggers = tokensOutPerIn(token0IsBase, strategy);
      } else {
        throw new Error('Invalid strategy mode');
      }

      const userAddress = wallet.connection.account;

      const takeFeeFromInput = tokenHierarchyLogic.shouldTakeFeeFromToken0(
        selectedExchange.identifiers.blockchain,
        selectedExchange.identifiers.chainId,
        inOutTokens.tokenInAddress,
        inOutTokens.tokenOutAddress
      );

      const strategyOutput: Strategy = {
        tokenPairAddress: tokenSearch.selectedPair.id,
        ...inOutTokens,
        ...priceTriggers,
        ...strategy.selectedExchange.identifiers,
        isUsdPriceRelatedToTokenIn: inOutTokens.tokenInAddress !== baseToken.id,
        maxAttempts: strategy.numRetries + 1,
        maxGasPriceInGwei: strategy.gwei,
        takeFeeFromInput: takeFeeFromInput,
        tokenOutAmount: null,
        userAddress,
        ...(!!strategy.slippagePercent && {
          slippagePercent: strategy.slippagePercent,
        }),
        identifier: sha256(uuid.v4()),
      };
      await addStrategyAsync(provider, strategyOutput);

      // thunkAPI.dispatch(toastSuccess("Congratulations! You have successfully added a Velox Strategy!"))
      thunkAPI.dispatch(
        strategySlice.actions.openConfirmDeploymentSuccessModalModal()
      );
      thunkAPI.dispatch(getUserStrategies({}));
      loggerWithCloud.sendToCloud(
        `Successfully added strategy strategy:${stringify({
          selectedExchange,
          strategy,
          token0,
          token1,
          wallet,
        })}`,
        'log'
      );
    } catch (e: any) {
      if (e.response?.data?.error?.startsWith('Not enough')) {
        thunkAPI.dispatch(
          toastError(
            'Strategy not deployed because tokens did not have enough allowance.'
          )
        );
      }
      loggerWithCloud.sendToCloud(
        `Error adding strategy strategy:${stringify({
          selectedExchange,
          strategy,
          token0,
          token1,
          wallet,
        })} error:${stringify(e, Object.getOwnPropertyNames(e))}`,
        'error'
      );
      thunkAPI.dispatch(
        strategySlice.actions.openConfirmDeploymentErrorModalModal()
      );
    } finally {
      thunkAPI.dispatch(strategySlice.actions.closeReviewModal());
    }
  }
);

export const getUserStrategies = createAsyncThunk(
  'strategy/search',
  async (payload: any, thunkAPI: any) => {
    try {
      const state = thunkAPI.getState().velox;
      const auth = state.strategy.cachedAuth;
      const partnerStrategies: Array<PartnerStrategyDeployed> =
        await getUserStrategiesAsync(state.wallet.connection.account, auth);
      const tokensInStrategies = uniq(
        flatten(
          partnerStrategies.map((s) => [
            s.tokenInAddress.toLowerCase(),
            s.tokenOutAddress.toLowerCase(),
          ])
        )
      );
      const strategies = partnerStrategies.map(recaclulateAndInjectMinMax);

      const tokenNameDictionary = await getTokenNameDictionary(
        tokensInStrategies
      );

      return strategies
        .map((strategy) => {
          const emergencyInSymbol = strategy.tokenInAddress.slice(0, 9) + '...';
          const emergencyOutSymbol =
            strategy.tokenOutAddress.slice(0, 9) + '...';
          return {
            ...strategy,
            // @ts-ignore
            inToken: tokenNameDictionary?.[strategy.blockchain]?.[
              strategy.tokenInAddress.toLowerCase()
            ] || {
              address: strategy.tokenInAddress,
              name: emergencyInSymbol,
              symbol: emergencyInSymbol,
            },

            maxUsdPrice:
              strategy.maxUsdPrice && new BN(strategy.maxUsdPrice).toString(),

            minUsdPrice:
              strategy.minUsdPrice && new BN(strategy.minUsdPrice).toString(),

            // @ts-ignore
            outToken: tokenNameDictionary?.[strategy.blockchain]?.[
              strategy.tokenOutAddress.toLowerCase()
            ] || {
              address: strategy.tokenOutAddress,
              name: emergencyOutSymbol,
              symbol: emergencyOutSymbol,
            },
            tokenInAmount:
              strategy.tokenInAmount &&
              new BN(strategy.tokenInAmount)
                .shiftedBy(-strategy.tokenInDecimals)
                .toString(),
          };
        })
        .sort(
          (s1, s2) =>
            new Date(s2.created_at).getTime() -
            new Date(s1.created_at).getTime()
        );
    } catch (err) {
      loggerWithCloud.log(
        'getUserStrategies err:',
        stringify(err, Object.getOwnPropertyNames(err))
      );
      thunkAPI.dispatch(
        toastError('Something went wrong getting your networkLogos strategies')
      );
      throw err;
    }
  }
);

export const recreateUserStrategy = createAsyncThunk(
  'strategy/recreate',
  async (payload: any, thunkAPI: any) => {
    try {
      const { provider, strategy } = payload;
      const tokenInAmount = new BN(strategy.tokenInAmount)
        .shiftedBy(strategy.tokenInDecimals)
        .toString();
      const oldIdentifier = strategy.identifier;
      const userAddress = strategy.userAddress;

      const strategyOutput = {
        ...strategy,
        identifier: sha256(uuid.v4()),
        tokenInAmount,
      };
      await addStrategyAsync(provider, strategyOutput);
      thunkAPI.dispatch(
        toastSuccess('Strategy re-created, sign again to delete')
      );
      await deleteStrategyAsync(provider, userAddress, oldIdentifier);
    } catch (e) {
      loggerWithCloud.sendToCloud(
        `Error re-creating strategy, error:${stringify(
          e,
          Object.getOwnPropertyNames(e)
        )}`,
        'error'
      );
      thunkAPI.dispatch(
        toastError('Something went wrong re-creating this strategy')
      );
    } finally {
      thunkAPI.dispatch(getUserStrategies({}));
    }
  }
);

export const deleteUserStrategy = createAsyncThunk(
  'strategy/delete',
  async (payload: any, thunkAPI: any) => {
    const { identifier, provider } = payload;
    try {
      const userAddress = thunkAPI.getState().velox.wallet.connection.account;
      await deleteStrategyAsync(provider, userAddress, identifier);
      thunkAPI.dispatch(getUserStrategies({}));
      thunkAPI.dispatch(toastSuccess('Strategy deleted'));
    } catch (e) {
      loggerWithCloud.sendToCloud(
        `Error deleting strategy id:${identifier}, error:${stringify(
          e,
          Object.getOwnPropertyNames(e)
        )}`,
        'error'
      );
      thunkAPI.dispatch(
        toastError('Something went wrong deleting your strategy')
      );
    }
  }
);

export const toggleDirection = createAsyncThunk(
  'strategy/toggleDirection',
  async (payload: string, thunkAPI: any) => {
    const { strategy, tokenSearch } = thunkAPI.getState().velox;
    const { token0Price, token1Price } = tokenSearch.selectedPair;
    const { buyingToken0, token0Amount, token1Amount } = strategy;
    thunkAPI.dispatch(strategySlice.actions.swapPriceBound());
    if (buyingToken0) {
      thunkAPI.dispatch(
        strategySlice.actions.updateAmounts({
          token0Amount: new BN(token1Amount)
            .multipliedBy(token0Price)
            .toFixed(6, BN.ROUND_DOWN)
            .toString(), //todo max of balance
          token1Amount: token1Amount,
        })
      );
    } else {
      thunkAPI.dispatch(
        strategySlice.actions.updateAmounts({
          token0Amount: token0Amount,
          token1Amount: new BN(token0Amount)
            .multipliedBy(token1Price)
            .toFixed(6, BN.ROUND_DOWN)
            .toString(), //todo max of balance
        })
      );
    }
    thunkAPI.dispatch(estimateTradeEfficiency(''));
  }
);

export const estimateTradeEfficiency = createAsyncThunk(
  'strategy/tradeEfficiency',
  async (payload: string, thunkAPI: any) => {
    const { strategy, tokenSearch } = thunkAPI.getState().velox;
    const { selectedPair, serializedTradeEstimator } = tokenSearch;
    const { buyingToken0, token0Amount, token1Amount } = strategy;
    const amount = buyingToken0 ? token1Amount : token0Amount;
    const inputToken = buyingToken0
      ? selectedPair.token1.address
      : selectedPair.token0.address;
    if (serializedTradeEstimator && inputToken && amount) {
      const tradeEstimator = UniV2ClonesTradeEstimator.createFromSerialized(
        serializedTradeEstimator
      );
      return (
        await tradeEstimator.getTradeImpactDecimalNum(inputToken, amount)
      ).toFixed(2);
    }
    return '0';
  }
);

export const updateStrategyAmounts = createAsyncThunk(
  'strategy/amountChange',
  async (payload: string, thunkAPI: any) => {
    const state = thunkAPI.getState().velox;
    const amount = payload;
    const token0Price = state.tokenSearch.selectedPair.token0Price;
    const token1Price = state.tokenSearch.selectedPair.token1Price;
    if (parseFloat(amount) >= 0 || amount === '' || amount === '.') {
      //move this logic into fulfilled extraReducers
      if (state.strategy.buyingToken0) {
        thunkAPI.dispatch(
          strategySlice.actions.updateAmounts({
            token0Amount: new BN(amount).multipliedBy(token0Price).toString(),
            token1Amount: amount,
          })
        );
      } else {
        thunkAPI.dispatch(
          strategySlice.actions.updateAmounts({
            token0Amount: amount,
            token1Amount: new BN(amount).multipliedBy(token1Price).toString(),
          })
        );
      }
    }
    thunkAPI.dispatch(estimateTradeEfficiency(''));
  }
);
export const setSelectedExchange = createAsyncThunk(
  'strategy/setSelectedExchange',
  async (payload: string, thunkAPI: any) => {
    //dispatching the action like this so it runs prior ro the searchTokenPairs
    thunkAPI.dispatch(strategySlice.actions.setSelectedExchangeAction(payload));
    thunkAPI.dispatch(resetSearchOnNewExchange(''));
    return payload;
  }
);

export const strategySlice = createSlice({
  extraReducers: (builder) => {
    builder.addCase(PROVIDER_DISCONNECT, (state: any) => {
      //todo
    });
    builder.addCase(estimateTradeEfficiency.fulfilled, (state, action) => {
      state.priceImpact = action.payload || '0';
    });
    builder.addCase(toggleDirection.fulfilled, (state) => {
      state.buyingToken0 = !state.buyingToken0;
    });
    // builder.addCase(setSelectedExchange.fulfilled, (state, action: any)=>{
    //   state.selectedExchange = action.payload
    // })

    builder.addCase(getUserStrategies.fulfilled, (state, action: any) => {
      state.currentPage = 0;
      state.strategies = action.payload || [];
      state.initialStrategiesLoading = false;
      state.getStrategiesError = false;
    });
    builder.addCase(getUserStrategies.rejected, (state, action: any) => {
      loggerWithCloud.sendToCloud(
        `getUserStrategies error:${stringify(action)}`,
        'error'
      );
      state.getStrategiesError = true;
    });
  },
  initialState: {
    buyingToken0: true,
    cachedAuth: {
      message: '',
      signedMessage: '',
    },
    confirmDeploymentErrorModalOpen: false,
    confirmDeploymentSuccessModalOpen: false,
    currentPage: 0,
    getStrategiesError: false,
    gwei: 300,
    initialStrategiesLoading: true,
    isListOpened: false,
    numRetries: 0,
    pageCount: 0,
    price: 0,
    priceImpact: '0',
    priceIsUpperBound: true,
    reviewModalOpen: false,
    selectedExchange: getDefaultExchange(),
    slippagePercent: 0.5,
    strategies: [],
    strategiesFilters: { selectedExchange: undefined },
    strategyMode: usd,
    token0Amount: '',
    token1Amount: '',
  },
  name: 'strategy',
  reducers: {
    closeConfirmDeploymentErrorModal: (state) => {
      state.confirmDeploymentErrorModalOpen = false;
    },
    closeConfirmDeploymentSuccessModal: (state) => {
      state.confirmDeploymentSuccessModalOpen = false;
      state.isListOpened = true;
    },
    closeList: (state) => {
      state.isListOpened = false;
    },
    closeReviewModal: (state) => {
      state.reviewModalOpen = false;
    },
    openConfirmDeploymentErrorModalModal: (state) => {
      state.confirmDeploymentErrorModalOpen = true;
    },
    openConfirmDeploymentSuccessModalModal: (state) => {
      state.confirmDeploymentSuccessModalOpen = true;
    },
    openList: (state) => {
      state.isListOpened = true;
    },
    openReviewModal: (state) => {
      state.reviewModalOpen = true;
    },
    setRetries: (state, action) => {
      state.numRetries = action.payload;
    },
    setSelectedExchangeAction: (state, action) => {
      state.selectedExchange = action.payload;

      setDefaultExchange(state.selectedExchange);
    },
    setSlippagePercent: (state, action) => {
      const amount = action.payload;
      if (
        amount === '' ||
        amount === '.' ||
        (parseFloat(amount) < 99.99 && parseFloat(amount) >= 0)
      ) {
        state.slippagePercent = action.payload;
      }
    },
    setStrategiesFilter: (state, action) => {
      state.strategiesFilters = action.payload;
      state.currentPage = 0;
    },
    setStrategyMode: (state, action) => {
      state.strategyMode = action.payload;
    },
    swapPriceBound: (state) => {
      state.priceIsUpperBound = !state.priceIsUpperBound;
    },
    updateAmounts: (state, action: any) => {
      state.token0Amount = action.payload.token0Amount;
      state.token1Amount = action.payload.token1Amount;
    },
    updateCachedAuth: (state, action) => {
      state.cachedAuth = action.payload;
    },
    updateCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    updateGwei: (state, action) => {
      const val = action.payload;
      if (parseInt(val) > 0 || val === '') {
        state.gwei = val;
      }
    },
    updatePrice: (state, action) => {
      const val = action.payload;
      if (parseFloat(val) >= 0 || val === '' || val === '.') {
        state.price = val;
      }
    },
  },
});

export const {
  closeConfirmDeploymentErrorModal,
  closeConfirmDeploymentSuccessModal,
  closeList,
  closeReviewModal,
  openConfirmDeploymentErrorModalModal,
  openList,
  openReviewModal,
  setRetries,
  setSlippagePercent,
  setStrategiesFilter,
  setStrategyMode,
  swapPriceBound,
  updateCachedAuth,
  updateCurrentPage,
  updateGwei,
  updatePrice,
} = strategySlice.actions;

export default strategySlice.reducer;
