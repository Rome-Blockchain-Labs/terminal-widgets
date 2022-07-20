import { createReducer } from '@reduxjs/toolkit';

import { Field, resetMintState, typeInput } from './actions';

export interface MintState {
  readonly independentField: Field;
  readonly typedValue: string;
  readonly otherTypedValue: string; // for the case when there's no liquidity
}

const initialState: MintState = {
  independentField: Field.CURRENCY_A,
  otherTypedValue: '',
  typedValue: '',
};

export default createReducer<MintState>(initialState, (builder) =>
  builder
    .addCase(resetMintState, () => initialState)
    .addCase(
      typeInput,
      (state, { payload: { field, noLiquidity, typedValue } }) => {
        if (noLiquidity) {
          // they're typing into the field they've last typed in
          if (field === state.independentField) {
            return {
              ...state,
              independentField: field,
              typedValue,
            };
          }
          // they're typing into a new field, store the other value
          else {
            return {
              ...state,
              independentField: field,
              otherTypedValue: state.typedValue,
              typedValue,
            };
          }
        } else {
          return {
            ...state,
            independentField: field,
            otherTypedValue: '',
            typedValue,
          };
        }
      }
    )
);
