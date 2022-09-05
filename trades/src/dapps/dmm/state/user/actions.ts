import { createAction } from '@reduxjs/toolkit';
import { TokenList } from '@uniswap/token-lists';

import { SupportedLocale } from '../../constants/locales';

export interface SerializedToken {
  chainId: number;
  address: string;
  decimals: number;
  symbol?: string;
  name?: string;
  logoURI?: string;
  list?: TokenList;
}

export interface SerializedPair {
  token0: SerializedToken;
  token1: SerializedToken;
}

export const updateMatchesDarkMode = createAction<{ matchesDarkMode: boolean }>(
  'dmm/user/updateMatchesDarkMode'
);
export const updateUserDarkMode = createAction<{ userDarkMode: boolean }>(
  'dmm/user/updateUserDarkMode'
);
export const updateUserExpertMode = createAction<{ userExpertMode: boolean }>(
  'dmm/user/updateUserExpertMode'
);
export const updateUserLocale = createAction<{ userLocale: SupportedLocale }>(
  'dmm/user/updateUserLocale'
);
export const updateUserSlippageTolerance = createAction<{
  userSlippageTolerance: number;
}>('dmm/user/updateUserSlippageTolerance');
export const updateUserDeadline = createAction<{ userDeadline: number }>(
  'dmm/user/updateUserDeadline'
);
export const addSerializedToken = createAction<{
  serializedToken: SerializedToken;
}>('dmm/user/addSerializedToken');
export const removeSerializedToken = createAction<{
  chainId: number;
  address: string;
}>('dmm/user/removeSerializedToken');
export const addSerializedPair = createAction<{
  serializedPair: SerializedPair;
}>('dmm/user/addSerializedPair');
export const removeSerializedPair = createAction<{
  chainId: number;
  tokenAAddress: string;
  tokenBAddress: string;
}>('dmm/user/removeSerializedPair');
export const toggleURLWarning = createAction<void>('dmm/app/toggleURLWarning');
export const toggleRebrandingAnnouncement = createAction<void>(
  'dmm/app/toggleRebrandingAnnouncement'
);
