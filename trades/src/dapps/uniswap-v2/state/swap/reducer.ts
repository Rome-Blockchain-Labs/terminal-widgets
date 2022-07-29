import { createReducer } from '@reduxjs/toolkit';

import {
  Field,
  replaceSwapState,
  selectCurrency,
  setRecipient,
  switchCurrencies,
  typeInput,
} from './actions';

export interface SwapState {
  readonly independentField: Field;
  readonly typedValue: string;
  readonly [Field.INPUT]: {
    readonly currencyId: string | undefined;
    // readonly currency: Token | undefined;
  };
  readonly [Field.OUTPUT]: {
    readonly currencyId: string | undefined;
    // readonly currency: Token | undefined;
  };
  // the typed recipient address or ENS name, or null if swap should go to sender
  readonly recipient: string | null;
}

const initialState: SwapState = {
  independentField: Field.INPUT,
  recipient: null,
  [Field.INPUT]: {
    // currency: undefined,
    currencyId: ''
  },
  [Field.OUTPUT]: {
    // currency: undefined,
    currencyId: ''
  },
  typedValue: '',
};

export default createReducer<SwapState>(initialState, (builder) =>
  builder
    .addCase(
      replaceSwapState,
      (
        state,
        {
          payload: {
            field,
            inputCurrency,
            outputCurrency,
            recipient,
            typedValue,
          },
        }
      ) => {
        return {
          [Field.INPUT]: {
            currency:inputCurrency,
            currencyId: inputCurrency?.address,
          },
          [Field.OUTPUT]: {
            currency:outputCurrency,
            currencyId: outputCurrency?.address,
          },
          independentField: field,
          recipient,
          typedValue: typedValue,
        };
      }
    )
    .addCase(selectCurrency, (state, { payload: { currencyId, field } }) => {
      const otherField = field === Field.INPUT ? Field.OUTPUT : Field.INPUT;
      if (currencyId === state[otherField].currencyId) {
        // the case where we have to swap the order
        return {
          ...state,
          [field]: { currencyId: currencyId },
          independentField:
            state.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
          [otherField]: { currencyId: state[field].currencyId },
        };
      } else {
        // the normal case
        return {
          ...state,
          [field]: { currencyId: currencyId },
        };
      }
    })
    .addCase(switchCurrencies, (state) => {
      return {
        ...state,
        independentField:
          state.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
        [Field.INPUT]: { currencyId: state[Field.OUTPUT].currencyId },
        [Field.OUTPUT]: { currencyId: state[Field.INPUT].currencyId },
      };
    })
    .addCase(typeInput, (state, { payload: { field, typedValue } }) => {
      return {
        ...state,
        independentField: field,
        typedValue,
      };
    })
    .addCase(setRecipient, (state, { payload: { recipient } }) => {
      state.recipient = recipient;
    })
);
