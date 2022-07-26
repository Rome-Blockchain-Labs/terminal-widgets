import { tokenHierarchyLogic } from '@rbl/velox-common';
import {
  getWrappedNativeToken,
  isWrappedNativeToken,
} from '@rbl/velox-common/multiChains';
import BN from 'bignumber.js';
import { utils } from 'ethers';
import { createSelector } from 'reselect';

import {
  DEFAULT_PAGE_SIZE,
  gasGweiToMinWeth,
  minWethAllowance,
} from '../config';
import { ExchangeParams } from '../containers/exchangeSelector/allowableExchanges';
import { Strategy } from '../model/strategy';
import { Token } from '../model/token';
BN.config({ EXPONENTIAL_AT: [-50, 50] });

const getActiveAllowance = (selectedExchange: ExchangeParams, token: Token) => {
  //todo look through/sum all contracts
  if (
    isWrappedNativeToken(
      selectedExchange.identifiers.blockchain,
      selectedExchange.identifiers.chainId,
      token.id
    )
  ) {
    return minWethAllowance;
  }
  return 0;
};

const strategy = (state: any) => state?.velox?.strategy;
const selectedPair = (state: any) => state?.velox?.tokenSearch.selectedPair;
const quotas = (state: any) => state?.velox?.quotas;

export const INVALID = {
  STEP1_GAS: 'You need to set a bigger gas limit',
  STEP1_NULL_PAIR: 'You need to select a token pair',
  STEP2_ALLOWANCE: 'Your token allowances are not high enough',
  STEP3_AMOUNT: 'Can not place a strategy for 0 tokens',
  STEP3_BALANCE: 'Your token amount cannot be greater than balance',
  STEP3_PRICE: 'The price must be more than 0',
  STEP3_PRICE_MOVEMENT: 'You did not allow for enough price movement',
};

export const token0IsBaseSelector = createSelector(
  [strategy, selectedPair],
  (strategy, selectedPair) => {
    if (selectedPair) {
      const { token0, token1 } = selectedPair;
      const { selectedExchange } = strategy;
      return tokenHierarchyLogic.isToken0BaseOfPair(
        selectedExchange.identifiers.blockchain,
        selectedExchange.identifiers.chainId,
        token0.id,
        token1.id
      );
    } else return false;
  }
);

export const minAllowances = createSelector(
  [strategy, selectedPair],
  (strategy, selectedPair) => {
    const { buyingToken0, selectedExchange, token0Amount, token1Amount } =
      strategy;

    if (!selectedPair) {
      return { token0MinAllowance: 0, token1MinAllowance: 0 };
    }

    const { token0, token1 } = selectedPair;
    const token0ActiveAllowance = getActiveAllowance(selectedExchange, token0);
    const token1ActiveAllowance = getActiveAllowance(selectedExchange, token1);
    const token0AdditionalAllowance = buyingToken0 ? 0 : token0Amount;
    const token1AdditionalAllowance = buyingToken0 ? token1Amount : 0;
    const token0RequiredAllowance = new BN(token0ActiveAllowance)
      .plus(token0AdditionalAllowance)
      .toString();
    const token1RequiredAllowance = new BN(token1ActiveAllowance)
      .plus(token1AdditionalAllowance)
      .toString();
    return {
      token0MinAllowance: token0RequiredAllowance,
      token1MinAllowance: token1RequiredAllowance,
    };
  }
);

//todo compose the above state into this
export const validateStrategy = createSelector(
  [strategy, selectedPair, quotas],
  (strategy, selectedPair, quotas) => {
    /** set user feedback **/
    let invalidReasons = [];

    if (!selectedPair) {
      invalidReasons.push(INVALID.STEP1_NULL_PAIR);
      return invalidReasons;
    }

    const {
      buyingToken0,
      gwei,
      price,
      priceImpact,
      selectedExchange,
      slippagePercent,
      token0Amount,
      token1Amount,
    } = strategy;
    const { token0, token1 } = selectedPair;

    const wrappedNativeRequiredAllowance = new BN(gasGweiToMinWeth)
      .multipliedBy(strategy.gwei)
      .toString();
    const wrappedNativeAddress = getWrappedNativeToken(
      selectedExchange.identifiers.blockchain,
      selectedExchange.identifiers.chainId
    );

    const token0ActiveAllowance = getActiveAllowance(selectedExchange, token0);
    const token1ActiveAllowance = getActiveAllowance(selectedExchange, token1);
    const token0AdditionalAllowance = buyingToken0 ? 0 : token0Amount;
    const token1AdditionalAllowance = buyingToken0 ? token1Amount : 0;
    const token0RequiredAllowance = new BN(token0ActiveAllowance)
      .plus(token0AdditionalAllowance)
      .toString();
    const token1RequiredAllowance = new BN(token1ActiveAllowance)
      .plus(token1AdditionalAllowance)
      .toString();

    // for XXX/YYY pairs-- invalidReasons.push("You need more wrapped Eth")
    if (!(Number(token0Amount) > 0 && Number(token1Amount) > 0)) {
      invalidReasons.push(INVALID.STEP3_AMOUNT);
    }
    if (!(parseFloat(price) > 0)) {
      //todo check > if buying VS < if selling
      invalidReasons.push(INVALID.STEP3_PRICE);
    }
    if (!(parseFloat(gwei) > 0)) {
      invalidReasons.push(INVALID.STEP1_GAS);
    }

    // while allowances are loading, this will assume NOT invalid
    if (
      new BN(token0RequiredAllowance).gt(quotas[token0.id].allowance.value) ||
      new BN(token1RequiredAllowance).gt(quotas[token1.id].allowance.value) ||
      new BN(wrappedNativeRequiredAllowance).gt(
        quotas?.[wrappedNativeAddress]?.allowance?.value
      )
    ) {
      invalidReasons.push(INVALID.STEP2_ALLOWANCE);
    }

    // validate balances
    if (
      !buyingToken0 &&
      new BN(token0RequiredAllowance).gt(quotas[token0.id].balance.value)
    ) {
      invalidReasons.push(INVALID.STEP3_BALANCE);
    }

    if (
      buyingToken0 &&
      new BN(token1RequiredAllowance).gt(quotas[token1.id].balance.value)
    ) {
      invalidReasons.push(INVALID.STEP3_BALANCE);
    }

    if (
      !slippagePercent ||
      new BN(slippagePercent).minus(0.001).lt(priceImpact)
    ) {
      invalidReasons.push(INVALID.STEP3_PRICE_MOVEMENT);
    }
    return invalidReasons;
  }
);

const strategyAuth = (state: any) => state?.velox?.strategy.cachedAuth;
const currentAccount = (state: any): string =>
  state?.velox?.wallet.connection.account;

export const hasValidAuth = createSelector(
  [strategyAuth, currentAccount],
  (strategyAuth, currentAccount) => {
    const { message, signedMessage } = strategyAuth;
    try {
      const addressFromSignedMessage = utils.verifyMessage(
        message,
        signedMessage
      );
      return (
        addressFromSignedMessage.toLowerCase() === currentAccount.toLowerCase()
      );
    } catch {
      return false;
    }
  }
);

const strategyConfig = (state: any) => state?.velox?.strategyConfig;
export const strategyConfigStepCompletions = createSelector(
  [strategyConfig],
  (strategyConfig) => {
    const { completeStep1, completeStep2, completeStep3, completeStep4 } =
      strategyConfig;

    return { completeStep1, completeStep2, completeStep3, completeStep4 };
  }
);

export const filteredStrategies = createSelector([strategy], (strategy) => {
  const { strategies, strategiesFilters } = strategy;
  return strategies.filter((strat: Strategy) => {
    if (
      strategiesFilters?.selectedExchange &&
      strategiesFilters?.selectedExchange !== strat.exchange
    )
      return false;
    return true;
  });
});

export const filteredStrategiesPageCount = createSelector(
  [filteredStrategies],
  (filteredStrategies) => {
    return Math.ceil(filteredStrategies.length / DEFAULT_PAGE_SIZE);
  }
);
