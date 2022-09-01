import { createAction } from '@reduxjs/toolkit';

export enum Field {
  CURRENCY_A = 'CURRENCY_A',
  CURRENCY_B = 'CURRENCY_B',
}

export const typeInput = createAction<{
  field: Field;
  typedValue: string;
  noLiquidity: boolean;
}>('dmm/mint/typeInputMint');
export const switchTokenField = createAction<{ field: Field }>(
  'dmm/mint/switchTokenField'
);
export const resetMintState = createAction<void>('dmm/mint/resetMintState');
