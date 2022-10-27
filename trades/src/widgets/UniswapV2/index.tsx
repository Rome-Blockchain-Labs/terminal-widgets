import 'twin.macro';

import { NetworkName as VeloxNetworkName } from '@rbl/velox-common/multiChains';
import {
  getAddChainParameters,
  useWallets,
  useWeb3React,
} from '@romeblockchain/wallet';
import { AddEthereumChainParameter } from '@web3-react/types';
import queryString from 'query-string';
import React, { FC, memo, useContext, useEffect, useState } from 'react';
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
import AddressModal from '../../dapps/uniswap-v2/components/AddressModal';
import IFrameProvider from '../../dapps/uniswap-v2/components/IFrameProvider';
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
  const { chainId, connector, isActivating } = useWeb3React();

  const { setSelectedWallet } = useWallets();
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

    const fetchTokenList = async () => {
      let res = await fetch(defaultListOfLists[0]).catch((err) =>
        console.log('Failed to fetch from 1st list with error', err)
      );

      if (!res) {
        res = await fetch(defaultListOfLists[1]).catch((err) =>
          console.log('Failed to fetch from 2nd list with error', err)
        );
        setDefaultTokenList(defaultListOfLists[1]);
      } else {
        setDefaultTokenList(defaultListOfLists[0]);
      }

      if (res) {
        const responseData = await res.json();

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
      }
    };
    fetchTokenList();
  }, [
    exchangeName,
    widget.exchange,
    widget.network,
    widget.token_in,
    widget.token_out,
  ]);

  if (!chainParams) {
    return null;
  }
  return (
    <div
      id={uid}
      tw="flex justify-center items-center h-[100vh]  bg-dark-500 relative"
    >
      <PageContextProvider>
        <Provider store={store}>
          <IFrameProvider>
            <WalletModal chainParams={chainParams} />
            <AddressModal />
            {targetChainID === chainId && (
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
            )}
          </IFrameProvider>
        </Provider>
      </PageContextProvider>
    </div>
  );
});
