import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { ChainId } from '@dynamic-amm/sdk';
import { createAction } from '@reduxjs/toolkit';
import { TokenList } from '@uniswap/token-lists';

export type PopupContent =
  | {
      txn: {
        hash: string;
        success: boolean;
        summary?: string;
      };
    }
  | {
      listUpdate: {
        listUrl: string;
        oldList: TokenList;
        newList: TokenList;
        auto: boolean;
      };
    };

export enum ApplicationModal {
  NETWORK,
  WALLET,
  SETTINGS,
  TRANSACTION_SETTINGS,
  SELF_CLAIM,
  ADDRESS_CLAIM,
  CLAIM_POPUP,
  MENU,
  DELEGATE,
  VOTE,
  PRICE_RANGE,
  POOL_DETAIL,
  FARM_HISTORY,
  ADDRESS,
}

export const updateBlockNumber = createAction<{
  chainId: number;
  blockNumber: number;
}>('dmm/application/updateBlockNumber');

export const setAddressOpenModal = createAction<boolean | null>(
  'dmm/application/addressOpenModal'
);

export const setOpenModal = createAction<ApplicationModal | null>(
  'dmm/application/setOpenModal'
);
export const addPopup = createAction<{
  key?: string;
  removeAfterMs?: number | null;
  content: PopupContent;
}>('dmm/application/addPopup');
export const removePopup = createAction<{ key: string }>(
  'dmm/application/removePopup'
);
export const updateETHPrice = createAction<{
  currentPrice: string;
  oneDayBackPrice: string;
  pricePercentChange: number;
}>('dmm/application/updateETHPrice');

export const updateKNCPrice = createAction<string | undefined>(
  'dmm/application/updateKNCPrice'
);

export const updateChainIdWhenNotConnected = createAction<ChainId>(
  'dmm/application/updateChainIdWhenNotConnected'
);

export const setExchangeSubgraphClient = createAction<{
  [key: string]: ApolloClient<NormalizedCacheObject>;
}>('dmm/application/setExchangeSubgraphClient');
export const setGasPrice = createAction<{ [key: string]: string } | undefined>(
  'dmm/application/setGasPrice'
);
