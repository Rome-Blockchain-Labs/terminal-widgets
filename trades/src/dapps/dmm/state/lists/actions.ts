import { ActionCreatorWithPayload, createAction } from '@reduxjs/toolkit';
import { TokenList, Version } from '@uniswap/token-lists';

export const fetchTokenList: Readonly<{
  pending: ActionCreatorWithPayload<{ url: string; requestId: string }>;
  fulfilled: ActionCreatorWithPayload<{
    url: string;
    tokenList: TokenList;
    requestId: string;
  }>;
  rejected: ActionCreatorWithPayload<{
    url: string;
    errorMessage: string;
    requestId: string;
  }>;
}> = {
  fulfilled: createAction('dmm/lists/fetchTokenList/fulfilled'),
  pending: createAction('dmm/lists/fetchTokenList/pending'),
  rejected: createAction('dmm/lists/fetchTokenList/rejected'),
};

// add and remove from list options
export const addList = createAction<string>('dmm/lists/addList');
export const removeList = createAction<string>('dmm/lists/removeList');

// select which lists to search across from loaded lists
export const enableList = createAction<string>('dmm/lists/enableList');
export const disableList = createAction<string>('dmm/lists/disableList');

// versioning
export const acceptListUpdate = createAction<string>(
  'dmm/lists/acceptListUpdate'
);
export const rejectVersionUpdate = createAction<Version>(
  'dmm/lists/rejectVersionUpdate'
);
