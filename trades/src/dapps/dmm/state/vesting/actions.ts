import { Token } from '@dynamic-amm/sdk';
import { BigNumber } from '@ethersproject/bignumber';
import { createAction } from '@reduxjs/toolkit';

export const setLoading = createAction<boolean>('dmm/vesting/setLoading');
export const setSchedulesByRewardLocker = createAction<{
  [key: string]: [BigNumber, BigNumber, BigNumber, BigNumber, Token, number][];
}>('dmm/vesting/setSchedulesByRewardLocker');
export const setShowConfirm = createAction<boolean>(
  'dmm/vesting/setShowConfirm'
);
export const setAttemptingTxn = createAction<boolean>(
  'dmm/vesting/setAttemptingTxn'
);
export const setTxHash = createAction<string>('dmm/vesting/setTxHash');
export const setVestingError = createAction<string>(
  'dmm/vesting/setVestingError'
);
