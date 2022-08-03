import 'twin.macro';

import { ApolloProvider } from '@apollo/client';
import { ChainId } from '@dynamic-amm/sdk';
import React, { useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { KYBER_KRYSTAL_API } from '../../../config';
import { useWallets } from '../../../contexts/WalletsContext/WalletContext';
import { AppDispatch } from '../../../store';
import { DmmContext, DmmPage } from '../../../widgets/Dmm/DmmContext';
import { defaultExchangeClient } from '../apollo/client';
import Popups from '../components/Popups';
import SettingsModal from '../components/SettingsModal';
import Web3ReactManager from '../components/Web3ReactManager';
import { BLACKLIST_WALLETS } from '../constants';
import { setGasPrice } from '../state/application/actions';
import { useExchangeClient } from '../state/application/hooks';
import AddLiquidity from './AddLiquidity';
import CreatePool from './CreatePool';
import Pool from './Pool';
import PoolFinder from './PoolFinder';
import Pools from './Pools';
import RemoveLiquidity from './RemoveLiquidity';
import Swap from './Swap';

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  width: 100%;
  align-items: flex-start;
`;

const BodyWrapper = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  width: calc(100% - 20px);
  align-items: center;
  margin:10px;

  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1;
`;

export default function App() {
  const { account, chainId } = useWallets();
  const apolloClient = useExchangeClient();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchGas = (chain: string) => {
      fetch(KYBER_KRYSTAL_API + `/${chain}/v2/swap/gasPrice`)
        .then((res) => res.json())
        .then((json) => {
          dispatch(setGasPrice(!!json.error ? undefined : json.gasPrice));
        })
        .catch((e) => {
          dispatch(setGasPrice(undefined));
          console.error(e);
        });
    };

    let interval: any = null;
    const chain =
      chainId === ChainId.MAINNET
        ? 'ethereum'
        : chainId === ChainId.BSCMAINNET
        ? 'bsc'
        : chainId === ChainId.AVAXMAINNET
        ? 'avalanche'
        : chainId === ChainId.MATIC
        ? 'polygon'
        : '';
    if (!!chain) {
      fetchGas(chain);
      interval = setInterval(() => fetchGas(chain), 30000);
    } else dispatch(setGasPrice(undefined));
    return () => {
      clearInterval(interval);
    };
  }, [chainId, dispatch]);
  const { page } = useContext(DmmContext);

  return (
    <>
      {(!account || !BLACKLIST_WALLETS.includes(account)) && (
        <ApolloProvider client={apolloClient || defaultExchangeClient}>
          <AppWrapper tw="text-gray-200">
            {/* <HeaderWrapper>
              <Header />
            </HeaderWrapper> */}

            <Web3ReactManager>
              <BodyWrapper>
                <Popups />
                {page === DmmPage.SWAP && <Swap />}
                {page === DmmPage.POOL && <Pool />}
                {page === DmmPage.POOLFINDER && <PoolFinder />}
                {page === DmmPage.POOLS && <Pools />}
                {page === DmmPage.CREATEPOOL && <CreatePool />}
                {page === DmmPage.ADDLIQUIDITY && <AddLiquidity />}
                {page === DmmPage.REMOVELIQUIDITY && <RemoveLiquidity />}
                <SettingsModal />
              </BodyWrapper>
            </Web3ReactManager>
          </AppWrapper>
        </ApolloProvider>
      )}
    </>
  );
}