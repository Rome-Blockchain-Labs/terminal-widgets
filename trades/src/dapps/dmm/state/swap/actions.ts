import { createAction } from '@reduxjs/toolkit';

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
}

export const selectCurrency = createAction<{
  field: Field;
  currencyId: string;
}>('dmm/swap/selectCurrency');
export const chooseToSaveGas = createAction<{ saveGas: boolean }>(
  'dmm/swap/chooseToSaveGas'
);
export const switchCurrencies = createAction<void>('dmm/swap/switchCurrencies');
export const switchCurrenciesV2 = createAction<void>(
  'dmm/swap/switchCurrenciesV2'
);
export const typeInput =
  createAction<{ field: Field; typedValue: string }>('dmm/swap/typeInput');
export const replaceSwapState = createAction<{
  field: Field;
  typedValue: string;
  inputCurrencyId?: string;
  outputCurrencyId?: string;
  recipient: string | null;
}>('dmm/swap/replaceSwapState');
export const setRecipient = createAction<{ recipient: string | null }>(
  'dmm/swap/setRecipient'
);
