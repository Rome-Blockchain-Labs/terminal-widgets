import 'twin.macro';

import { ExchangeName } from '@rbl/velox-common/multiChains';
import React, { FC, memo, useEffect, useRef, useState } from 'react';
import { ReactNode } from 'react';
import { useDispatch } from 'react-redux';

import Web3ReactManager from '../../components/Web3ReactManager';
import { NetworkName } from '../../constants/networkExchange';
import { DappContextProvider } from '../../contexts';
import { WidgetState } from '../../types';
import SettingsModal from './components/SettingsModal';
import { usePageContext } from './PageContext';
import AddLiquidity from './pages/AddLiquidity';
import Pool from './pages/Pool';
import PoolFinder from './pages/PoolFinder';
import RemoveLiquidity from './pages/RemoveLiquidity';
import Swap from './pages/Swap';
import { AppDispatch } from './state';
import { useSettingsModalToggle } from './state/application/hooks';
import { selectList } from './state/lists/actions';
import ThemeProvider from './theme';
import Updaters from './Updaters';

export const widgetName = 'UniswapV2';

export enum UniswapPage {
  SWAP,
  POOL,
  ADD_LIQUIDITY,
  CREATE_LIQUIDITY,
  REMOVE_LIQUIDITY,
  POOL_FINDER,
}

export type UniswapV2Props = {
  defaultTokenList: string | undefined;
  widget: WidgetState;
  backgroundImage: ReactNode;
  exchange: ExchangeName;
  network: NetworkName;
  //pageOverride allows the parent component to force switch to a new page
  //the app can then change without the parent knowing
  pageOverride?: UniswapPage;
  //settingsOpenOverride could potentially get out of sync, but since its only
  //used as a toggle, this is acceptable
  settingsOpenOverride?: boolean;
};

export const UniswapApp: FC<UniswapV2Props> = memo(
  ({
    defaultTokenList,
    backgroundImage,
    exchange,
    network,
    widget,
    pageOverride = UniswapPage.SWAP,
    settingsOpenOverride = false,
  }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { page, setPage } = usePageContext();
    const toggle = useSettingsModalToggle();
    const [removeLiquidityCurrencies, setRemoveLiquidityCurrencies] = useState<
      string[]
    >([]);
    const [addLiquidityCurrencies, setAddLiquidityCurrencies] = useState<
      string[]
    >([]);
    useEffect(() => {
      if (defaultTokenList) {
        dispatch(selectList(defaultTokenList));
      }
    }, [defaultTokenList, dispatch]);

    useEffect(() => {
      setPage(pageOverride);
    }, [pageOverride, setPage]);
    const isFirstRenderSkipToggleSettings = useRef(true);
    useEffect(() => {
      if (isFirstRenderSkipToggleSettings.current) {
        isFirstRenderSkipToggleSettings.current = false;
        return;
      }
      toggle();
    }, [settingsOpenOverride, toggle]);

    useEffect(() => {
      if (page !== UniswapPage.ADD_LIQUIDITY && addLiquidityCurrencies.length) {
        setAddLiquidityCurrencies([]);
      }
    }, [addLiquidityCurrencies.length, page]);

    useEffect(() => {
      if (
        page !== UniswapPage.REMOVE_LIQUIDITY &&
        removeLiquidityCurrencies.length
      ) {
        setAddLiquidityCurrencies([]);
      }
    }, [page, removeLiquidityCurrencies.length]);

    return (
      <DappContextProvider
        exchange={exchange}
        network={network}
        widgetId={widget.uid}
      >
        <Updaters />
        <ThemeProvider>
          <div tw="w-full h-full relative bg-dark-500">
            <div tw="opacity-50 h-full w-full absolute flex">
              {backgroundImage}
            </div>
            <div tw="h-full overflow-auto relative">
              <div tw="flex flex-col justify-center items-center p-4 min-h-full">
                <Web3ReactManager>
                  {page === UniswapPage.SWAP && (
                    <Swap defaultPair={widget.pair} />
                  )}
                  {page === UniswapPage.POOL && (
                    <Pool
                      onAddLiquidity={(currencyA, currencyB) => {
                        setPage(UniswapPage.ADD_LIQUIDITY);
                        setAddLiquidityCurrencies([
                          currencyA || '',
                          currencyB || '',
                        ]);
                      }}
                      onCreateLiquidity={() =>
                        setPage(UniswapPage.CREATE_LIQUIDITY)
                      }
                      onPoolFinder={() => setPage(UniswapPage.POOL_FINDER)}
                      onRemoveLiquidity={(currencyA, currencyB) => {
                        setPage(UniswapPage.REMOVE_LIQUIDITY);
                        setRemoveLiquidityCurrencies([currencyA, currencyB]);
                      }}
                    />
                  )}
                  {(page === UniswapPage.ADD_LIQUIDITY ||
                    page === UniswapPage.CREATE_LIQUIDITY) && (
                    <AddLiquidity
                      currencyIdA={addLiquidityCurrencies[0]}
                      currencyIdB={addLiquidityCurrencies[1]}
                      newLiquidity={page === UniswapPage.CREATE_LIQUIDITY}
                      onBack={() => setPage(UniswapPage.POOL)}
                    />
                  )}
                  {page === UniswapPage.REMOVE_LIQUIDITY &&
                    removeLiquidityCurrencies.length >= 2 && (
                      <RemoveLiquidity
                        currencyIdA={removeLiquidityCurrencies[0]}
                        currencyIdB={removeLiquidityCurrencies[1]}
                        onBack={() => setPage(UniswapPage.POOL)}
                      />
                    )}
                  {page === UniswapPage.POOL_FINDER && (
                    <PoolFinder
                      onAddLiquidity={(currencyA, currencyB) => {
                        setPage(UniswapPage.ADD_LIQUIDITY);
                        setAddLiquidityCurrencies([
                          currencyA || '',
                          currencyB || '',
                        ]);
                      }}
                      onBack={() => setPage(UniswapPage.POOL)}
                    />
                  )}
                </Web3ReactManager>
              </div>
            </div>
          </div>
          <SettingsModal />
        </ThemeProvider>
      </DappContextProvider>
    );
  }
);

export default UniswapApp;
