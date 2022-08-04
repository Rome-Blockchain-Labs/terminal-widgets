import { Currency, CurrencyAmount, ZERO } from '@dynamic-amm/sdk';
import { useWeb3React } from '@romeblockchain/wallet';
import { useMemo } from 'react';

import { BAD_RECIPIENT_ADDRESSES } from '../../constants';
import { useCurrency } from '../../hooks/Tokens';
import { useTradeExactInV2 } from '../../hooks/Trades';
import useENS from '../../hooks/useENS';
import { isAddress } from '../../utils';
import { Aggregator } from '../../utils/aggregator';
import { convertToNativeTokenFromETH } from '../../utils/dmm';
import { computeSlippageAdjustedAmounts } from '../../utils/prices';
import { useUserSlippageTolerance } from '../user/hooks';
import { useCurrencyBalances } from '../wallet/hooks';
import { Field } from './actions';
import { tryParseAmount, useSwapState } from './hooks';
import { AggregationComparer } from './types';

// from the current swap inputs, compute the best trade and return it.
export function useDerivedSwapInfoV2(): {
  currencies: { [field in Field]?: Currency };
  currencyBalances: { [field in Field]?: CurrencyAmount };
  parsedAmount: CurrencyAmount | undefined;
  v2Trade: Aggregator | undefined;
  tradeComparer: AggregationComparer | undefined;
  inputError?: string;
  onRefresh: () => void;
} {
  const { account, chainId } = useWeb3React();

  const {
    independentField,
    recipient,
    saveGas,
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState();

  const inputCurrency = useCurrency(inputCurrencyId);
  const outputCurrency = useCurrency(outputCurrencyId);
  const recipientLookup = useENS(recipient ?? undefined);
  const to: string | null =
    (recipient === null ? account : recipientLookup.address) ?? null;

  const relevantTokenBalances = useCurrencyBalances(account ?? undefined, [
    inputCurrency ?? undefined,
    outputCurrency ?? undefined,
  ]);

  const isExactIn: boolean = independentField === Field.INPUT;
  const parsedAmount = tryParseAmount(
    typedValue,
    (isExactIn ? inputCurrency : outputCurrency) ?? undefined
  );

  const {
    comparer: baseTradeComparer,
    onUpdateCallback,
    trade: bestTradeExactIn,
  } = useTradeExactInV2(
    isExactIn ? parsedAmount : undefined,
    outputCurrency ?? undefined,
    saveGas
  );

  const tradeComparer = useMemo((): AggregationComparer | undefined => {
    if (
      bestTradeExactIn?.outputAmount?.greaterThan(ZERO) &&
      baseTradeComparer?.outputAmount?.greaterThan(ZERO)
      // && baseTradeComparer?.outputPriceUSD
    ) {
      try {
        const diffAmount = bestTradeExactIn.outputAmount.subtract(
          baseTradeComparer.outputAmount
        );
        const diffAmountUSD =
          parseFloat(bestTradeExactIn.receivedUsd) -
          parseFloat(baseTradeComparer.receivedUsd);
        if (
          diffAmount.greaterThan(ZERO) &&
          parseFloat(bestTradeExactIn.receivedUsd) > 0 &&
          parseFloat(baseTradeComparer.receivedUsd) > 0 &&
          diffAmountUSD > 0
        ) {
          const savedUsd = diffAmountUSD;
          // const savedUsd = parseFloat(diffAmount.toFixed()) * parseFloat(baseTradeComparer.outputPriceUSD.toString())
          if (savedUsd) {
            return Object.assign({}, baseTradeComparer, {
              tradeSaved: { usd: savedUsd.toString() },
            });
          }
        }
      } catch (e) {}
    }
    return baseTradeComparer ?? undefined;
  }, [bestTradeExactIn, baseTradeComparer]);

  const v2Trade = isExactIn ? bestTradeExactIn : undefined;

  const currencyBalances = {
    [Field.INPUT]: relevantTokenBalances[0],
    [Field.OUTPUT]: relevantTokenBalances[1],
  };

  const currencies: { [field in Field]?: Currency } = {
    [Field.INPUT]: inputCurrency ?? undefined,
    [Field.OUTPUT]: outputCurrency ?? undefined,
  };

  let inputError: string | undefined;
  if (!account) {
    inputError = 'Connect wallet';
  }

  if (!parsedAmount) {
    if (typedValue) inputError = inputError ?? 'Invalid amount';
    else inputError = inputError ?? 'Enter an amount';
  }

  if (!currencies[Field.INPUT] || !currencies[Field.OUTPUT]) {
    inputError = inputError ?? 'Select a token';
  }

  const formattedTo = isAddress(to);
  if (!to || !formattedTo) {
    inputError = inputError ?? 'Enter a recipient';
  } else {
    if (BAD_RECIPIENT_ADDRESSES.indexOf(formattedTo) !== -1) {
      inputError = inputError ?? 'Invalid recipient';
    }
  }

  const [allowedSlippage] = useUserSlippageTolerance();

  const slippageAdjustedAmounts =
    v2Trade &&
    allowedSlippage &&
    computeSlippageAdjustedAmounts(v2Trade, allowedSlippage);

  // compare input balance to max input based on version
  const [balanceIn, amountIn] = [
    currencyBalances[Field.INPUT],
    slippageAdjustedAmounts ? slippageAdjustedAmounts[Field.INPUT] : null,
  ];

  if (amountIn && ((balanceIn && balanceIn.lessThan(amountIn)) || !balanceIn)) {
    inputError = `Insufficient ${
      convertToNativeTokenFromETH(amountIn.currency, chainId).symbol
    } balance`;
  }

  return {
    currencies,
    currencyBalances,
    inputError,
    onRefresh: onUpdateCallback,
    parsedAmount,
    tradeComparer,
    v2Trade: v2Trade ?? undefined,
  };
}
