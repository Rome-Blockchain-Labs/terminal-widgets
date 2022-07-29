import { parseUnits } from '@ethersproject/units';
import { NETWORKS } from '@rbl/velox-common/multiChains';
import {
  ChainId,
  Currency,
  CurrencyAmount,
  FACTORY_ADDRESS,
  JSBI,
  Token,
  TokenAmount,
  Trade,
} from '@rbl/velox-common/uniV2ClonesSDK';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { NetworkName } from '../../../../constants/networkExchange';
import { useWallets } from '../../../../contexts/WalletsContext/WalletContext';
import { Token as PairToken } from '../../../../types/pair';
import { getDefaultCurrencySymbol, isAddress } from '../../../../utils';
import { useCurrency } from '../../hooks/Tokens';
import { useTradeExactIn, useTradeExactOut } from '../../hooks/Trades';
import useENS from '../../hooks/useENS';
import { computeSlippageAdjustedAmounts } from '../../utils/prices';
import { AppDispatch, AppState } from '..';
import { useUserSlippageTolerance } from '../user/hooks';
import { useCurrencyBalances } from '../wallet/hooks';
import {
  Field,
  replaceSwapState,
  selectCurrency,
  setRecipient,
  switchCurrencies,
  typeInput,
} from './actions';

export function useSwapState(): AppState['swap'] {
  return useSelector<AppState, AppState['swap']>((state) => state.swap);
}

export function useSwapActionHandlers(): {
  onCurrencySelection: (field: Field, currency: Currency) => void;
  onSwitchTokens: () => void;
  onUserInput: (field: Field, typedValue: string) => void;
  onChangeRecipient: (recipient: string | null) => void;
} {
  const dispatch = useDispatch<AppDispatch>();
  const onCurrencySelection = useCallback(
    (field: Field, currency: Currency & { isNative?: boolean }) => {
      dispatch(
        selectCurrency({
          currencyId:
            currency instanceof Token
              ? currency.address
              : currency.isNative
              ? 'AVAX'
              : '',
          field,
        })
      );
    },
    [dispatch]
  );

  const onSwitchTokens = useCallback(() => {
    dispatch(switchCurrencies());
  }, [dispatch]);

  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      dispatch(typeInput({ field, typedValue }));
    },
    [dispatch]
  );

  const onChangeRecipient = useCallback(
    (recipient: string | null) => {
      dispatch(setRecipient({ recipient }));
    },
    [dispatch]
  );

  return {
    onChangeRecipient,
    onCurrencySelection,
    onSwitchTokens,
    onUserInput,
  };
}

// try to parse a user entered amount for a given token
export function tryParseAmount(
  value?: string,
  currency?: Currency
): CurrencyAmount | undefined {
  if (!value || !currency) {
    return undefined;
  }
  try {
    const typedValueParsed = parseUnits(value, currency.decimals).toString();
    if (typedValueParsed !== '0') {
      return currency instanceof Token
        ? new TokenAmount(currency, JSBI.BigInt(typedValueParsed))
        : CurrencyAmount.ether(JSBI.BigInt(typedValueParsed));
    }
  } catch (error) {
    // should fail if the user specifies too many decimal places of precision (or maybe exceed max uint?)
    console.debug(`Failed to parse input amount: "${value}"`, error);
  }
  // necessary for all paths to return a value
  return undefined;
}

const BAD_RECIPIENT_ADDRESSES: string[] = [
  FACTORY_ADDRESS[ChainId.AVALANCHE_MAINNET][
    NETWORKS.AVALANCHE.MAINNET.PANGOLIN.NAME
  ], // v2 factory
  '0xE54Ca86531e17Ef3616d22Ca28b0D458b6C89106', // v2 router 02
];

/**
 * Returns true if any of the pairs or tokens in a trade have the given checksummed address
 * @param trade to check for the given address
 * @param checksummedAddress address to check in the pairs and tokens
 */
function involvesAddress(trade: Trade, checksummedAddress: string): boolean {
  return (
    trade.route.path.some((token) => token.address === checksummedAddress) ||
    trade.route.pairs.some(
      (pair) => pair.liquidityToken.address === checksummedAddress
    )
  );
}

// from the current swap inputs, compute the best trade and return it.
export function useDerivedSwapInfo(network: NetworkName): {
  currencies: { [field in Field]?: Currency };
  currencyBalances: { [field in Field]?: CurrencyAmount };
  parsedAmount: CurrencyAmount | undefined;
  v2Trade: Trade | undefined;
  inputError?: string;
} {
  const { account } = useWallets();

  const {
    independentField,
    recipient,
    typedValue,
    // @ts-ignore//todo
    [Field.INPUT]: { currency: inputCurrencyParam, currencyId: currencyInID },
    [Field.OUTPUT]: {
      // @ts-ignore//todo
      currency: outputCurrencyParam,
      currencyId: currencyOutID,
    },
  } = useSwapState();
  const derivedCurrencyIn = useCurrency(currencyInID, network);

  const derivedCurrencyOut = useCurrency(currencyOutID, network);

  const inputCurrency = derivedCurrencyIn
    ? derivedCurrencyIn
    : inputCurrencyParam;
  const outputCurrency = derivedCurrencyOut
    ? derivedCurrencyOut
    : outputCurrencyParam;
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

  const bestTradeExactIn = useTradeExactIn(
    isExactIn ? parsedAmount : undefined,
    outputCurrency ?? undefined
  );
  const bestTradeExactOut = useTradeExactOut(
    inputCurrency ?? undefined,
    !isExactIn ? parsedAmount : undefined
  );

  const v2Trade = isExactIn ? bestTradeExactIn : bestTradeExactOut;

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
    inputError = 'Connect Wallet';
  }

  if (!parsedAmount) {
    inputError = inputError ?? 'ENTER AN AMOUNT';
  }

  if (!currencies[Field.INPUT] || !currencies[Field.OUTPUT]) {
    inputError = inputError ?? 'Select a token';
  }

  const formattedTo = isAddress(to);
  if (!to || !formattedTo) {
    inputError = inputError ?? 'Enter a recipient';
  } else {
    if (
      BAD_RECIPIENT_ADDRESSES.indexOf(formattedTo) !== -1 ||
      (bestTradeExactIn && involvesAddress(bestTradeExactIn, formattedTo)) ||
      (bestTradeExactOut && involvesAddress(bestTradeExactOut, formattedTo))
    ) {
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

  if (balanceIn && amountIn && balanceIn.lessThan(amountIn)) {
    inputError =
      'Insufficient ' +
      getDefaultCurrencySymbol(amountIn.currency) +
      ' balance';
  }

  return {
    currencies,
    currencyBalances,
    inputError,
    parsedAmount,
    v2Trade: v2Trade ?? undefined,
  };
}

// updates the swap state to use the defaults for a given network
export function useDefaultsFromURLSearch(
  inputCurrency: PairToken | undefined,
  outputCurrency: PairToken | undefined
) {
  const { chainId } = useWallets();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!chainId) return;

    dispatch(
      replaceSwapState({
        field: Field.INPUT,
        inputCurrency: inputCurrency,
        outputCurrency: outputCurrency,
        recipient: null,
        typedValue: '',
      })
    );
  }, [dispatch, chainId, inputCurrency, outputCurrency]);
}
