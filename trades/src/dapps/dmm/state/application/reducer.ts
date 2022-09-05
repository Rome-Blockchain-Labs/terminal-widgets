import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { ChainId } from '@dynamic-amm/sdk';
import { createReducer, nanoid } from '@reduxjs/toolkit';

import { exchangeClients } from '../../apollo/client';
import { setAddressOpenModal } from './actions';
import {
  addPopup,
  ApplicationModal,
  PopupContent,
  removePopup,
  setExchangeSubgraphClient,
  setGasPrice,
  setOpenModal,
  updateBlockNumber,
  updateChainIdWhenNotConnected,
  updateETHPrice,
  updateKNCPrice,
} from './actions';

type PopupList = Array<{
  key: string;
  show: boolean;
  content: PopupContent;
  removeAfterMs: number | null;
}>;

type ETHPrice = {
  currentPrice?: string;
  oneDayBackPrice?: string;
  pricePercentChange?: number;
};

export type GasPrice = {
  fast: string;
  standard: string;
  low: string;
  default: string;
};
export interface ApplicationState {
  readonly blockNumber: { readonly [chainId: number]: number };
  readonly popupList: PopupList;
  readonly openModal: ApplicationModal | null;
  readonly ethPrice: ETHPrice;
  readonly kncPrice?: string;
  readonly chainIdWhenNotConnected: ChainId;
  exchangeSubgraphClients: {
    [key: string]: ApolloClient<NormalizedCacheObject>;
  };
  readonly gasPrice?: GasPrice;

  readonly addressOpenModal: boolean | null;
}

const initialState: ApplicationState = {
  addressOpenModal: false,
  blockNumber: {},
  chainIdWhenNotConnected: ChainId.AVAXMAINNET,
  ethPrice: {},
  exchangeSubgraphClients: exchangeClients,
  kncPrice: '',
  openModal: null,
  popupList: [],
};

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updateBlockNumber, (state, action) => {
      const { blockNumber, chainId } = action.payload;
      if (typeof state.blockNumber[chainId] !== 'number') {
        state.blockNumber[chainId] = blockNumber;
      } else {
        state.blockNumber[chainId] = Math.max(
          blockNumber,
          state.blockNumber[chainId]
        );
      }
    })
    .addCase(setOpenModal, (state, action) => {
      state.openModal = action.payload;
    })
    .addCase(setAddressOpenModal, (state, action) => {
      state.addressOpenModal = action.payload;
    })
    .addCase(
      addPopup,
      (state, { payload: { content, key, removeAfterMs = 15000 } }) => {
        state.popupList = (
          key
            ? state.popupList.filter((popup) => popup.key !== key)
            : state.popupList
        ).concat([
          {
            content,
            key: key || nanoid(),
            removeAfterMs,
            show: true,
          },
        ]);
      }
    )
    .addCase(removePopup, (state, { payload: { key } }) => {
      state.popupList.forEach((p) => {
        if (p.key === key) {
          p.show = false;
        }
      });
    })
    .addCase(
      updateETHPrice,
      (
        state,
        { payload: { currentPrice, oneDayBackPrice, pricePercentChange } }
      ) => {
        state.ethPrice.currentPrice = currentPrice;
        state.ethPrice.oneDayBackPrice = oneDayBackPrice;
        state.ethPrice.pricePercentChange = pricePercentChange;
      }
    )
    .addCase(updateKNCPrice, (state, { payload: kncPrice }) => {
      state.kncPrice = kncPrice;
    })
    .addCase(updateChainIdWhenNotConnected, (state, { payload: chainId }) => {
      state.chainIdWhenNotConnected = chainId;
    })
    .addCase(
      setExchangeSubgraphClient,
      (state, { payload: exchangeSubgraphClients }) => {
        state.exchangeSubgraphClients = exchangeSubgraphClients as any;
      }
    )
    .addCase(setGasPrice, (state, { payload: gasPrice }) => {
      state.gasPrice = gasPrice as GasPrice;
    })
);
