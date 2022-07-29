import { currencyEquals, WETH } from '@dynamic-amm/sdk';
import React, { useContext, useState } from 'react';

import { useWallets } from '../../../../contexts/WalletsContext/WalletContext';
import { useSelector } from '../../../../hooks';
import { widgetByIdSelector } from '../../../../store/selectors/app';
import { DmmContext } from '../../../../widgets/Dmm/DmmContext';
import LiquidityProviderMode from '../../components/LiquidityProviderMode';
import { AddRemoveTabs } from '../../components/NavigationTabs';
import { MinimalPositionCard } from '../../components/PositionCard';
import { PairState } from '../../data/Reserves';
import { useCurrency } from '../../hooks/Tokens';
import { useDerivedMintInfo } from '../../state/mint/hooks';
import { useCurrencyConvertedToNative } from '../../utils/dmm';
import {
  Container,
  LiquidityProviderModeWrapper,
  PageWrapper,
  PoolName,
  TopBar,
} from './styled';
import TokenPair from './TokenPair';
import ZapIn from './ZapIn';

export default function AddLiquidity() {
  const { chainId } = useWallets();

  const { currencyIdA, currencyIdB, pairAddress } = useContext(DmmContext);

  const currencyA = useCurrency(currencyIdA);
  const currencyB = useCurrency(currencyIdB);

  const nativeA = useCurrencyConvertedToNative(currencyA || undefined);
  const nativeB = useCurrencyConvertedToNative(currencyB || undefined);

  const currencyAIsWETH = !!(
    chainId &&
    currencyA &&
    currencyEquals(currencyA, WETH[chainId as keyof typeof WETH])
  );
  const currencyBIsWETH = !!(
    chainId &&
    currencyB &&
    currencyEquals(currencyB, WETH[chainId as keyof typeof WETH])
  );

  const oneCurrencyIsWETH = currencyBIsWETH || currencyAIsWETH;

  const { noLiquidity, pair, pairState } = useDerivedMintInfo(
    currencyA ?? undefined,
    currencyB ?? undefined,
    pairAddress
  );

  const [activeTab, setActiveTab] = useState(0);

  const { widgetId } = useContext(DmmContext);

  const width =
    useSelector((state) => widgetByIdSelector(state)(widgetId).width) || 0;

  const above768 = width > 768;

  return (
    <>
      <PageWrapper>
        <Container>
          <AddRemoveTabs adding={true} creating={false} />

          <TopBar isMobile={above768}>
            <LiquidityProviderModeWrapper>
              <LiquidityProviderMode
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                singleTokenInfo={
                  'You can add liquidity to the pool by supplying a single token (either token from the token pair). We will automatically create LP tokens for you and add them to the liquidity pool - all in a single transaction'
                }
              />
            </LiquidityProviderModeWrapper>
            <PoolName>
              {nativeA?.symbol} - {nativeB?.symbol} pool
            </PoolName>
          </TopBar>

          {activeTab === 0 ? (
            <TokenPair
              currencyIdA={currencyIdA || ''}
              currencyIdB={currencyIdB || ''}
              pairAddress={pairAddress}
            />
          ) : (
            <ZapIn
              currencyIdA={currencyIdA || ''}
              currencyIdB={currencyIdB || ''}
              pairAddress={pairAddress}
            />
          )}
        </Container>

        {pair && !noLiquidity && pairState !== PairState.INVALID ? (
          <Container style={{ marginTop: '24px', padding: '0' }}>
            <MinimalPositionCard
              pair={pair}
              showUnwrapped={oneCurrencyIsWETH}
            />
          </Container>
        ) : null}
      </PageWrapper>
    </>
  );
}
