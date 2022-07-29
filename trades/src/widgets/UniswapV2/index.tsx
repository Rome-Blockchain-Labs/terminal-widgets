import 'twin.macro';

import { NetworkName as VeloxNetworkName } from '@rbl/velox-common/multiChains';
import { getAddChainParameters, useWeb3React } from '@romeblockchain/wallet';
import { AddEthereumChainParameter } from '@web3-react/types';
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
import { getChainIdByNetworkName } from '../../constants/networkExchange/index';
import UniswapV2Component, { UniswapPage } from '../../dapps/uniswap-v2/App';
import WalletModal from '../../dapps/uniswap-v2/components/WalletModal';
import { PageContextProvider } from '../../dapps/uniswap-v2/PageContext';
import { getStore } from '../../dapps/uniswap-v2/state';
import { getTokenListUrlsByExchangeName } from '../../dapps/uniswap-v2/token-list';
import { Token, WidgetCommonState } from '../../types';

interface QueryParams {
  network: NetworkName;
  exchange: ExchangeType;
  token_in?: string;
  token_out?: string;
}

export const UniswapV2Widget: FC<WidgetCommonState> = memo(({ uid }) => {
  const { chainId, connector } = useWeb3React();
  const [chainParams, setChainParams] = useState<
    number | AddEthereumChainParameter
  >();
  const [targetChainID, setTargetChainID] = useState<number>();

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

  const Icon = EXCHANGES.find((exchange) => {
    if (exchange.title === exchangeName) {
      return exchange;
    }
    return false;
  })?.icon;

  useEffect(() => {
    if (widget.network) {
      const targetChain = getChainIdByNetworkName(widget.network);
      const targetChainParams = getAddChainParameters(targetChain);
      setTargetChainID(targetChain);
      setChainParams(targetChainParams);
    }
  }, [widget.network]);

  useEffect(() => {
    const defaultListOfLists = getTokenListUrlsByExchangeName(
      exchangeName as any,
      widget.network.toUpperCase() as VeloxNetworkName
    );
    setDefaultTokenList(defaultListOfLists[0]);
    fetch(defaultListOfLists[0]).then((response) => {
      console.log(response);
      response.json().then((responseData) => {
        const tokenData = responseData.tokens
          ? responseData.tokens
          : responseData;
        const tokenIn = tokenData.find(
          (token: Token) =>
            token.address.toLowerCase() === widget.token_in?.toLowerCase()
        );
        const tokenOut = tokenData.find(
          (token: Token) =>
            token.address.toLowerCase() === widget.token_out?.toLowerCase()
        );
        if (tokenIn && tokenOut) {
          setTokens({ tokenIn, tokenOut });
        }
      });
    });
  }, [
    exchangeName,
    widget.exchange,
    widget.network,
    widget.token_in,
    widget.token_out,
  ]);
  useEffect(() => {
    if (chainId !== targetChainID && chainParams) {
      try {
        connector.activate(targetChainID);
      } catch (error) {
        connector.activate(chainParams);
      }
    }
  }, [chainId, chainParams, connector, targetChainID]);

  if (chainId !== targetChainID || !chainParams) {
    return null;
  }

  return (
    <div id={uid} tw="grid place-items-center h-screen bg-dark-500">
      <PageContextProvider>
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
      </PageContextProvider>
    </div>
  );
});
