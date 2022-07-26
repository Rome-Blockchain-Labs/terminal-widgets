import { Currency, ETHER, Pair, Token } from '@dynamic-amm/sdk';
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, AppState } from '../../../../store';
import { PairState, usePair } from '../../data/Reserves';
import { Field, selectCurrency } from './actions';

export function usePairState(): AppState['dapps']['dmm']['pair'] {
  return useSelector<AppState, AppState['dapps']['dmm']['pair']>(
    (state) => state.dapps.dmm.pair
  );
}

export function usePairActionHandlers(): {
  onCurrencySelection: (field: Field, currency: Currency) => void;
} {
  const dispatch = useDispatch<AppDispatch>();
  const onCurrencySelection = useCallback(
    (field: Field, currency: Currency) => {
      dispatch(
        selectCurrency({
          currencyId:
            currency instanceof Token
              ? currency.address
              : currency === ETHER
              ? 'ETH'
              : '',
          field,
        })
      );
    },
    [dispatch]
  );

  return {
    onCurrencySelection,
  };
}

export function useDerivedPairInfo(
  currencyA: Currency | undefined,
  currencyB: Currency | undefined
): {
  currencies: { [field in Field]?: Currency };
  pairs: [PairState, Pair | null][];
} {
  const currencies: { [field in Field]?: Currency } = useMemo(
    () => ({
      [Field.CURRENCY_A]: currencyA ?? undefined,
      [Field.CURRENCY_B]: currencyB ?? undefined,
    }),
    [currencyA, currencyB]
  );
  const pairs = usePair(
    currencies[Field.CURRENCY_A],
    currencies[Field.CURRENCY_B]
  );
  return {
    currencies,
    pairs,
  };
}
