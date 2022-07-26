import { createAction } from '@reduxjs/toolkit';

import { Farm } from '../farms/types';

export const setFarmsData = createAction<{ [key: string]: Farm[] }>(
  'dmm/farms/setFarmsData'
);
export const setLoading = createAction<boolean>('dmm/farms/setLoading');
export const setShowConfirm = createAction<boolean>(
  'dmm/vesting/setShowConfirm'
);
export const setAttemptingTxn = createAction<boolean>(
  'dmm/vesting/setAttemptingTxn'
);
export const setTxHash = createAction<string>('dmm/vesting/setTxHash');
export const setYieldPoolsError = createAction<string>(
  'dmm/vesting/setYieldPoolsError'
);
