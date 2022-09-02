import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { ChainId, Token, WETH } from '@dynamic-amm/sdk';
import { useWeb3React } from '@romeblockchain/wallet';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDeepCompareEffect } from 'react-use';

import { AppDispatch, AppState } from '../../../../store';
import { defaultExchangeClient } from '../../apollo/client';
import { ETH_PRICE, TOKEN_DERIVED_ETH } from '../../apollo/queries';
import { KNC, ZERO_ADDRESS } from '../../constants';
import { getBlockFromTimestamp, getPercentChange } from '../../utils';
import { setAddressOpenModal } from './actions';
import {
  addPopup,
  ApplicationModal,
  PopupContent,
  removePopup,
  setOpenModal,
  updateETHPrice,
  updateKNCPrice,
} from './actions';

export function useExchangeClient() {
  const { chainId } = useWeb3React();
  const exchangeSubgraphClients = useSelector(
    (state: AppState) => state.dapps.dmm.application.exchangeSubgraphClients
  );
  return useMemo(() => {
    if (!chainId) return defaultExchangeClient;
    return exchangeSubgraphClients[chainId] || defaultExchangeClient;
  }, [chainId, exchangeSubgraphClients]);
}

export function useBlockNumber(): number | undefined {
  const { chainId } = useWeb3React();

  return useSelector(
    (state: AppState) => state.dapps.dmm.application.blockNumber[chainId ?? -1]
  );
}

export function useModalOpen(modal: ApplicationModal): boolean {
  const openModal = useSelector(
    (state: AppState) => state.dapps.dmm.application.openModal
  );
  return openModal === modal;
}

export function useToggleModal(modal: ApplicationModal): () => void {
  const open = useModalOpen(modal);
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(
    () => dispatch(setOpenModal(open ? null : modal)),
    [dispatch, modal, open]
  );
}

export function useOpenModal(modal: ApplicationModal): () => void {
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(() => dispatch(setOpenModal(modal)), [dispatch, modal]);
}

export function useCloseModals(): () => void {
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(() => dispatch(setOpenModal(null)), [dispatch]);
}

export function useNetworkModalToggle(): () => void {
  return useToggleModal(ApplicationModal.NETWORK);
}

export function useAddressModalToggle() {
  const dispatch = useDispatch<AppDispatch>();
  const openModal = useSelector(
    (state: AppState) => state.dapps.dmm.application.addressOpenModal
  );
  const toggleAddressModal = () => {
    dispatch(setAddressOpenModal(openModal ? false : true));
  };
  return toggleAddressModal;
}

export function useWalletModalToggle(): () => void {
  return useToggleModal(ApplicationModal.WALLET);
}

export function useToggleSettingsMenu(): () => void {
  return useToggleModal(ApplicationModal.SETTINGS);
}

export function useToggleTransactionSettingsMenu(): () => void {
  return useToggleModal(ApplicationModal.TRANSACTION_SETTINGS);
}

export function useShowClaimPopup(): boolean {
  return useModalOpen(ApplicationModal.CLAIM_POPUP);
}

export function useToggleShowClaimPopup(): () => void {
  return useToggleModal(ApplicationModal.CLAIM_POPUP);
}

export function useToggleSelfClaimModal(): () => void {
  return useToggleModal(ApplicationModal.SELF_CLAIM);
}

export function useToggleDelegateModal(): () => void {
  return useToggleModal(ApplicationModal.DELEGATE);
}

export function useToggleVoteModal(): () => void {
  return useToggleModal(ApplicationModal.VOTE);
}

export function usePoolDetailModalToggle(): () => void {
  return useToggleModal(ApplicationModal.POOL_DETAIL);
}

export function useFarmHistoryModalToggle(): () => void {
  return useToggleModal(ApplicationModal.FARM_HISTORY);
}

// returns a function that allows adding a popup
export function useAddPopup(): (content: PopupContent, key?: string) => void {
  const dispatch = useDispatch();

  return useCallback(
    (content: PopupContent, key?: string) => {
      dispatch(addPopup({ content, key }));
    },
    [dispatch]
  );
}

// returns a function that allows removing a popup via its key
export function useRemovePopup(): (key: string) => void {
  const dispatch = useDispatch();
  return useCallback(
    (key: string) => {
      dispatch(removePopup({ key }));
    },
    [dispatch]
  );
}

// get the list of networkLogos popups
export function useActivePopups(): AppState['dapps']['dmm']['application']['popupList'] {
  const list = useSelector(
    (state: AppState) => state.dapps.dmm.application.popupList
  );
  return useMemo(() => list.filter((item) => item.show), [list]);
}

/**
 * Gets the current price  of ETH, 24 hour price, and % change between them
 */
const getEthPrice = async (
  chainId: ChainId,
  apolloClient: ApolloClient<NormalizedCacheObject>
) => {
  const utcCurrentTime = dayjs();
  const utcOneDayBack = utcCurrentTime
    .subtract(1, 'day')
    .startOf('minute')
    .unix();

  let ethPrice = 0;
  let ethPriceOneDay = 0;
  let priceChangeETH = 0;

  try {
    const oneDayBlock = await getBlockFromTimestamp(utcOneDayBack, chainId);
    const result = await apolloClient.query({
      fetchPolicy: 'network-only',
      query: ETH_PRICE(),
    });
    const resultOneDay = await apolloClient.query({
      fetchPolicy: 'network-only',
      query: ETH_PRICE(oneDayBlock),
    });
    const currentPrice = result?.data?.bundles[0]?.ethPrice;
    const oneDayBackPrice = resultOneDay?.data?.bundles[0]?.ethPrice;

    priceChangeETH = getPercentChange(currentPrice, oneDayBackPrice);
    ethPrice = currentPrice;
    ethPriceOneDay = oneDayBackPrice;
  } catch (e) {
    console.debug(e);
  }

  return [ethPrice, ethPriceOneDay, priceChangeETH];
};

export function useETHPrice(): AppState['dapps']['dmm']['application']['ethPrice'] {
  const dispatch = useDispatch();
  const { chainId } = useWeb3React();
  const blockNumber = useBlockNumber();
  const apolloClient = useExchangeClient();

  const ethPrice = useSelector(
    (state: AppState) => state.dapps.dmm.application.ethPrice
  );

  useEffect(() => {
    async function checkForEthPrice() {
      const [newPrice, oneDayBackPrice, pricePercentChange] = await getEthPrice(
        chainId as ChainId,
        apolloClient
      );
      dispatch(
        updateETHPrice({
          currentPrice: (newPrice ? newPrice : 0).toString(),
          oneDayBackPrice: (oneDayBackPrice ? oneDayBackPrice : 0).toString(),
          pricePercentChange,
        })
      );
    }
    checkForEthPrice();
  }, [ethPrice, dispatch, chainId, blockNumber, apolloClient]);

  return ethPrice;
}

/**
 * Gets the current price of KNC by ETH
 */
const getKNCPriceByETH = async (
  chainId: ChainId,
  apolloClient: ApolloClient<NormalizedCacheObject>
) => {
  let kncPriceByETH = 0;

  try {
    const result = await apolloClient.query({
      fetchPolicy: 'no-cache',
      query: TOKEN_DERIVED_ETH(KNC[chainId as ChainId].address),
    });

    const derivedETH = result?.data?.tokens[0]?.derivedETH;

    kncPriceByETH = parseFloat(derivedETH) || 0;
  } catch (e) {
    console.debug(e);
  }

  return kncPriceByETH;
};

export function useKNCPrice(): AppState['dapps']['dmm']['application']['kncPrice'] {
  const dispatch = useDispatch();
  const ethPrice = useETHPrice();
  const { chainId } = useWeb3React();
  const blockNumber = useBlockNumber();
  const apolloClient = useExchangeClient();

  const kncPrice = useSelector(
    (state: AppState) => state.dapps.dmm.application.kncPrice
  );

  useEffect(() => {
    async function checkForKNCPrice() {
      const kncPriceByETH = await getKNCPriceByETH(
        chainId as ChainId,
        apolloClient
      );
      const kncPrice =
        ethPrice.currentPrice &&
        kncPriceByETH * parseFloat(ethPrice.currentPrice);
      dispatch(updateKNCPrice(kncPrice?.toString()));
    }
    checkForKNCPrice();
  }, [
    kncPrice,
    dispatch,
    ethPrice.currentPrice,
    chainId,
    blockNumber,
    apolloClient,
  ]);

  return kncPrice;
}

/**
 * Gets the current price of KNC by ETH
 */
const getTokenPriceByETH = async (
  tokenAddress: string,
  apolloClient: ApolloClient<NormalizedCacheObject>
) => {
  let tokenPriceByETH = 0;

  try {
    const result = await apolloClient.query({
      fetchPolicy: 'no-cache',
      query: TOKEN_DERIVED_ETH(tokenAddress),
    });

    const derivedETH = result?.data?.tokens[0]?.derivedETH;

    tokenPriceByETH = parseFloat(derivedETH);
  } catch (e) {
    console.debug(e);
  }

  return tokenPriceByETH;
};

export function useTokensPrice(tokens: (Token | undefined)[]): number[] {
  const ethPrice = useETHPrice();
  const { chainId } = useWeb3React();
  const [prices, setPrices] = useState<number[]>([]);
  const apolloClient = useExchangeClient();

  useDeepCompareEffect(() => {
    async function checkForTokenPrice() {
      const tokensPrice = tokens.map(async (token) => {
        if (!token) {
          return 0;
        }

        if (!ethPrice?.currentPrice) {
          return 0;
        }

        if (
          token?.address === ZERO_ADDRESS.toLowerCase() ||
          token?.address === WETH[chainId as ChainId].address
        ) {
          return parseFloat(ethPrice.currentPrice);
        }

        const tokenPriceByETH = await getTokenPriceByETH(
          token?.address,
          apolloClient
        );
        const tokenPrice = tokenPriceByETH * parseFloat(ethPrice.currentPrice);

        return tokenPrice || 0;
      });

      const result = await Promise.all(tokensPrice);

      setPrices(result);
    }

    checkForTokenPrice();
  }, [ethPrice.currentPrice, chainId, tokens]);

  return prices;
}