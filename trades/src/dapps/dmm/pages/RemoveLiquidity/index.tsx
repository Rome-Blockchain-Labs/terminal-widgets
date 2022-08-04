import { currencyEquals, WETH } from '@dynamic-amm/sdk';
import { useWeb3React } from '@romeblockchain/wallet';
import { useContext, useState } from 'react';

import { DmmContext } from '../../../../widgets/Dmm/DmmContext';
import LiquidityProviderMode from '../../components/LiquidityProviderMode';
import { AddRemoveTabs } from '../../components/NavigationTabs';
import { MinimalPositionCard } from '../../components/PositionCard';
import { useCurrency } from '../../hooks/Tokens';
import { useDerivedBurnInfo } from '../../state/burn/hooks';
import { useCurrencyConvertedToNative } from '../../utils/dmm';
import {
  Container,
  LiquidityProviderModeWrapper,
  PageWrapper,
  PoolName,
  TopBar,
} from './styled';
import TokenPair from './TokenPair';
import ZapOut from './ZapOut';

export default function RemoveLiquidity() {
  const { currencyIdA, currencyIdB, pairAddress } = useContext(DmmContext);
  const [currencyA, currencyB] = [
    useCurrency(currencyIdA) ?? undefined,
    useCurrency(currencyIdB) ?? undefined,
  ];
  const { chainId } = useWeb3React();

  const nativeA = useCurrencyConvertedToNative(currencyA);
  const nativeB = useCurrencyConvertedToNative(currencyB);

  const { pair } = useDerivedBurnInfo(
    currencyA ?? undefined,
    currencyB ?? undefined,
    pairAddress
  );

  const oneCurrencyIsWETH = Boolean(
    chainId &&
      ((currencyA &&
        currencyEquals(WETH[chainId as keyof typeof WETH], currencyA)) ||
        (currencyB &&
          currencyEquals(WETH[chainId as keyof typeof WETH], currencyB)))
  );

  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <PageWrapper>
        <Container>
          <AddRemoveTabs adding={false} creating={false} />

          <TopBar>
            <LiquidityProviderModeWrapper>
              <LiquidityProviderMode
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                singleTokenInfo={
                  'We will automatically remove your liquidity and convert it into your desired token (either token from the token pair), all in a single transaction.'
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
            <ZapOut
              currencyIdA={currencyIdA || ''}
              currencyIdB={currencyIdB || ''}
              pairAddress={pairAddress}
            />
          )}
        </Container>

        {pair ? (
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
