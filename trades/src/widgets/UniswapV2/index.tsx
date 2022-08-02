import 'twin.macro';

import { NetworkName as VeloxNetworkName } from '@rbl/velox-common/multiChains';
import { useWeb3React } from '@romeblockchain/wallet';
import queryString from 'query-string';
import React, { FC, memo, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { EXCHANGES } from '../../constants';
import { ExchangeName } from '../../constants/multichain';
import {
  ExchangeType,
  getBasePairByNetworkExchange,
  NetworkName,
} from '../../constants/networkExchange/index';
import UniswapV2Component, { UniswapPage } from '../../dapps/uniswap-v2/App';
import IFrameProvider from '../../dapps/uniswap-v2/components/IFrameProvider';
import WalletModal from '../../dapps/uniswap-v2/components/WalletModal';
import { PageContextProvider } from '../../dapps/uniswap-v2/PageContext';
import { getStore } from '../../dapps/uniswap-v2/state';
import { getTokenListUrlsByExchangeName } from '../../dapps/uniswap-v2/token-list';
import { useDispatch } from '../../hooks/useDispatch';
import { toggleWalletModal } from '../../store/slices/app';
import { Token, WidgetCommonState } from '../../types';

interface QueryParams {
  network: NetworkName;
  exchange: ExchangeType;
  token_in?: string;
  token_out?: string;
}

export const UniswapV2Widget: FC<WidgetCommonState> = memo(({ uid }) => {
  // const [tokenIn, setTokenIn] = useState<Token>();
  // const [tokenOut, setTokenOut] = useState<Token>();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const { chainId, connector } = useWeb3React();

  const { search } = useLocation();
  const widget = queryString.parse(search) as unknown as QueryParams;
  const [pageOverride] = useState<UniswapPage>(UniswapPage.SWAP);
  const [settingOpen] = useState<boolean>(false);
  const [defaultTokenList, setDefaultTokenList] = useState<string>();
  const [tokens, setTokens] = useState<{ tokenIn: Token; tokenOut: Token }>(
    () => {
      const basePair = getBasePairByNetworkExchange(
        widget.network,
        widget.exchange
      );
      return {
        tokenIn: basePair.token0,
        tokenOut: basePair.token1,
      };
    }
  );
  const exchangeName = widget.exchange.toUpperCase() as ExchangeName;
  const store = getStore(
    uid,
    exchangeName as any,
    widget.network.toUpperCase() as VeloxNetworkName
  );
  const dispatch = useDispatch();

  const Icon = EXCHANGES.find((exchange) => {
    if (exchange.title === exchangeName) {
      return exchange;
    }
    return false;
  })?.icon;

  useEffect(() => {
    const defaultListOfLists = getTokenListUrlsByExchangeName(
      exchangeName as any,
      widget.network.toUpperCase() as VeloxNetworkName | undefined
    );
    setDefaultTokenList(defaultListOfLists[0]);
    fetch(defaultListOfLists[0]).then((response) =>
      response.json().then((responseData) => {
        const tokenIn = responseData.tokens.find(
          (token: Token) =>
            token.address.toLowerCase() === widget.token_in?.toLowerCase()
        );
        const tokenOut = responseData.tokens.find(
          (token: Token) =>
            token.address.toLowerCase() === widget.token_out?.toLowerCase()
        );
        if (tokenIn && tokenOut) {
          setTokens({ tokenIn, tokenOut });
        }
      })
    );
  }, [
    exchangeName,
    widget.exchange,
    widget.network,
    widget.token_in,
    widget.token_out,
  ]);
  useEffect(() => {
    if (chainId !== 43114) {
      console.log(connector);
      connector.activate(43114);
    }
  }, [chainId, connector]);
  if (chainId !== 43114) {
    return null;
  }

  return (
    <div id={uid} tw="grid place-items-center h-screen bg-dark-500">
      <PageContextProvider>
        <IFrameProvider>
          <Provider store={store}>
            <WalletModal />
            <UniswapV2Component
              backgroundImage={
                Icon && <Icon isBackground height="100%" width="100%" />
              }
              defaultTokenList={defaultTokenList}
              exchange={widget.exchange.toUpperCase() as any}
              network={widget.network}
              pageOverride={pageOverride}
              settingsOpenOverride={settingOpen}
              widget={{
                blockchain: widget.network,
                pair: {
                  address: '0x1',
                  blockchain: widget.network,
                  exchange: widget.exchange,
                  token0: tokens.tokenIn,
                  token1: tokens.tokenOut,
                },
                targetPosition: 1,
                uid: uid,
              }}
            />
          </Provider>
        </IFrameProvider>
      </PageContextProvider>
    </div>
  );
});
