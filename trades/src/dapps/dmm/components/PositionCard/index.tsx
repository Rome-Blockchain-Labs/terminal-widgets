import { Fraction, JSBI, Pair, Percent, TokenAmount } from '@dynamic-amm/sdk';
import { useWeb3React } from '@romeblockchain/wallet';
import React, { useContext, useState } from 'react';
import { Flex, Text } from 'rebass';
import styled from 'styled-components';
import tw from 'twin.macro';

import { DmmContext, DmmPage } from '../../../../widgets/Dmm/DmmContext';
import { ONE_BIPS } from '../../constants';
import { useTotalSupply } from '../../data/TotalSupply';
import { TokenWrapper } from '../../pages/AddLiquidity/styled';
import { useETHPrice, useTokensPrice } from '../../state/application/hooks';
import {
  useBulkPoolData,
  UserLiquidityPosition,
} from '../../state/pools/hooks';
import { useTokenBalance } from '../../state/wallet/hooks';
import { formattedNum } from '../../utils';
import { currencyId } from '../../utils/currencyId';
import {
  checkIsFarmingPool,
  getMyLiquidity,
  getTradingFeeAPR,
  useCurrencyConvertedToNative,
} from '../../utils/dmm';
import { unwrappedToken } from '../../utils/wrappedCurrency';
import { ButtonLight } from '../Button';
import Card, { LightCard } from '../Card';
import { AutoColumn } from '../Column';
import CurrencyLogo from '../CurrencyLogo';
import Divider from '../Divider';
import DoubleCurrencyLogo from '../DoubleLogo';
import DropIcon from '../Icons/DropIcon';
import WarningLeftIcon from '../Icons/WarningLeftIcon';
import InfoHelper from '../InfoHelper';
import { AutoRow, RowBetween, RowFixed } from '../Row';
import { MouseoverTooltip } from '../Tooltip';

export const FixedHeightRow = styled(RowBetween)`
  height: 24px;
`;

export const HoverCard = styled(Card)`
  border: 1px solid transparent;
  :hover {
  }
`;
const StyledPositionCard = styled(LightCard)`
  border: none;
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  padding: 32px 16px 20px;
  ${tw`bg-green-700`}
`;

const StyledMinimalPositionCard = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  padding: 1rem;
  align-items: flex-start;
  gap: 1rem;

  @media only screen and (min-width: 1000px) {
    flex-direction: row;
    align-items: center;
    padding: 20px 24px;
    gap: 1rem;
  }
`;

const MinimalPositionItem = styled(AutoColumn)<{
  noBorder?: boolean;
  noPadding?: boolean;
}>`
  width: 100%;
  padding-bottom: ${({ noPadding }) => (noPadding ? '0' : '1rem')};

  @media only screen and (min-width: 1000px) {
    width: fit-content;
    border-bottom: none;
    padding-right: ${({ noPadding }) => (noPadding ? '0' : '1rem')};
    padding-bottom: 0;
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
`;

const TokenRatioText = styled(Text)<{ isWarning: boolean }>``;

const WarningMessage = styled(Text)`
  text-align: center;
`;

const formattedUSDPrice = (tokenAmount: TokenAmount, price: number) => {
  const usdValue = parseFloat(tokenAmount.toSignificant(6)) * price;

  return <span>{`(~${formattedNum(usdValue.toString(), true)})`}</span>;
};

interface PositionCardProps {
  pair: Pair;
  showUnwrapped?: boolean;
  border?: string;
  stakedBalance?: TokenAmount; // optional balance to indicate that liquidity is deposited in mining pool
  myLiquidity?: UserLiquidityPosition;
}

export function NarrowPositionCard({
  border,
  pair,
  showUnwrapped = false,
}: PositionCardProps) {
  const { account } = useWeb3React();

  const currency0 = showUnwrapped ? pair.token0 : unwrappedToken(pair.token0);
  const currency1 = showUnwrapped ? pair.token1 : unwrappedToken(pair.token1);

  const [showMore, setShowMore] = useState(false);

  const userPoolBalance = useTokenBalance(
    account ?? undefined,
    pair.liquidityToken
  );
  const totalPoolTokens = useTotalSupply(pair.liquidityToken);

  const poolTokenPercentage =
    !!userPoolBalance &&
    !!totalPoolTokens &&
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
      : undefined;

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance),
        ]
      : [undefined, undefined];

  const native0 = useCurrencyConvertedToNative(currency0 || undefined);
  const native1 = useCurrencyConvertedToNative(currency1 || undefined);
  return (
    <>
      <StyledPositionCard border={border}>
        <AutoColumn gap="12px">
          <FixedHeightRow>
            <RowFixed>
              <span tw="text-xl font-medium">Your position</span>
            </RowFixed>
          </FixedHeightRow>
          <FixedHeightRow onClick={() => setShowMore(!showMore)}>
            <RowFixed>
              <DoubleCurrencyLogo
                currency0={native0}
                currency1={native1}
                margin={true}
                size={20}
              />
              <span tw="text-xl font-medium">
                {native0?.symbol}/{native1?.symbol}
              </span>
            </RowFixed>
            <RowFixed>
              <span tw="text-xl font-medium">
                {userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}{' '}
              </span>
            </RowFixed>
          </FixedHeightRow>
          <AutoColumn gap="4px">
            <FixedHeightRow>
              <span tw="text-xl font-medium">Your pool share:</span>
              <span tw="text-xl font-medium">
                {poolTokenPercentage
                  ? poolTokenPercentage.toFixed(6) + '%'
                  : '-'}
              </span>
            </FixedHeightRow>
            <FixedHeightRow>
              <span tw="text-xl font-medium">{native0?.symbol}:</span>
              {token0Deposited ? (
                <RowFixed>
                  <span tw="text-xl font-medium ml-1.5">
                    {token0Deposited?.toSignificant(6)}
                  </span>
                </RowFixed>
              ) : (
                '-'
              )}
            </FixedHeightRow>
            <FixedHeightRow>
              <span tw="text-xl font-medium">{native1?.symbol}:</span>
              {token1Deposited ? (
                <RowFixed>
                  <span tw="text-xl font-medium ml-1.5">
                    {token1Deposited?.toSignificant(6)}
                  </span>
                </RowFixed>
              ) : (
                '-'
              )}
            </FixedHeightRow>
          </AutoColumn>
        </AutoColumn>
      </StyledPositionCard>
    </>
  );
}

export function MinimalPositionCard({
  pair,
  showUnwrapped = false,
}: PositionCardProps) {
  const { account } = useWeb3React();

  const currency0 = showUnwrapped ? pair.token0 : unwrappedToken(pair.token0);
  const currency1 = showUnwrapped ? pair.token1 : unwrappedToken(pair.token1);

  const userPoolBalance = useTokenBalance(
    account ?? undefined,
    pair.liquidityToken
  );
  const totalPoolTokens = useTotalSupply(pair.liquidityToken);

  const poolTokenPercentage =
    !!userPoolBalance &&
    !!totalPoolTokens &&
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
      : undefined;

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance),
        ]
      : [undefined, undefined];

  const native0 = useCurrencyConvertedToNative(currency0 || undefined);
  const native1 = useCurrencyConvertedToNative(currency1 || undefined);

  const usdPrices = useTokensPrice([pair.token0, pair.token1]);

  return (
    <>
      <StyledMinimalPositionCard>
        <MinimalPositionItem
          style={{ alignItems: 'center', display: 'flex', height: '100%' }}
        >
          <span tw="text-base font-medium">Your Current Position</span>
        </MinimalPositionItem>

        <MinimalPositionItem gap="8px">
          <RowFixed>
            <DoubleCurrencyLogo
              currency0={native0}
              currency1={native1}
              size={16}
            />
            <span tw="text-base font-medium ml-1">
              {native0?.symbol}/{native1?.symbol} LP Tokens
            </span>
          </RowFixed>
          <RowFixed>
            <span tw="text-base font-medium">
              {userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}{' '}
            </span>
          </RowFixed>
        </MinimalPositionItem>

        <MinimalPositionItem>
          <AutoRow justify="space-evenly" style={{ gap: '1rem' }}>
            <MinimalPositionItem>
              <TokenWrapper>
                <CurrencyLogo currency={native0} size="16px" />
                <span tw="text-base font-medium">{native0?.symbol}</span>
              </TokenWrapper>

              {token0Deposited ? (
                <RowFixed>
                  <span tw="text-base font-medium">
                    {token0Deposited.equalTo('0')
                      ? '0'
                      : token0Deposited.lessThan(
                          new Fraction(JSBI.BigInt(1), JSBI.BigInt(100))
                        )
                      ? '<0.01'
                      : token0Deposited?.toSignificant(6)}{' '}
                    {formattedUSDPrice(token0Deposited, usdPrices[0])}
                  </span>
                </RowFixed>
              ) : (
                '-'
              )}
            </MinimalPositionItem>

            <MinimalPositionItem noBorder={true} noPadding={true}>
              <TokenWrapper>
                <CurrencyLogo currency={native1} size="16px" />
                <span tw="text-base font-medium">{native1?.symbol}</span>
              </TokenWrapper>
              {token1Deposited ? (
                <RowFixed>
                  <span tw="text-base font-medium">
                    {token1Deposited.equalTo('0')
                      ? '0'
                      : token1Deposited.lessThan(
                          new Fraction(JSBI.BigInt(1), JSBI.BigInt(100))
                        )
                      ? '<0.01'
                      : token1Deposited?.toSignificant(6)}{' '}
                    {formattedUSDPrice(token1Deposited, usdPrices[1])}
                  </span>
                </RowFixed>
              ) : (
                '-'
              )}
            </MinimalPositionItem>
          </AutoRow>
        </MinimalPositionItem>

        <MinimalPositionItem gap="8px" noBorder={true} noPadding={true}>
          <span tw="text-base font-medium">Your share of pool</span>
          <span tw="text-base font-medium">
            {poolTokenPercentage && poolTokenPercentage.greaterThan('0')
              ? poolTokenPercentage?.lessThan(ONE_BIPS)
                ? '<0.01'
                : poolTokenPercentage?.toFixed(2)
              : '0'}
            %
          </span>
        </MinimalPositionItem>
      </StyledMinimalPositionCard>
    </>
  );
}

const Tabs = styled.div`
  border-radius: 999px;
  margin-top: 1.5rem;
  display: flex;
  align-items: center;
`;

const TabItem = styled.div<{ active: boolean }>`
  border-radius: 999px;

  flex: 1;
  text-align: center;
  cursor: pointer;
  padding: 6px;
  font-weight: 500;
  font-size: 14px;
`;

const Row = styled(Flex)`
  justify-content: space-between;
  font-weight: 500;
  margin-top: 8px;
  font-size: 12px;
`;

const RemoveBtn = styled(ButtonLight)``;

export default function FullPositionCard({
  border,
  myLiquidity,
  pair,
  stakedBalance,
}: PositionCardProps) {
  const { account, chainId } = useWeb3React();

  const { setCurrencyIdA, setCurrencyIdB, setPage, setPairAddress } =
    useContext(DmmContext);

  const isFarmingPool = checkIsFarmingPool(pair.address, chainId);

  const ethPrice = useETHPrice();

  const { data: poolsData } = useBulkPoolData(
    [pair.address.toLowerCase()],
    ethPrice.currentPrice
  );

  const poolData = poolsData?.[0];

  const volume = poolData?.oneDayVolumeUSD || poolData?.oneDayVolumeUntracked;
  const fee = poolData?.oneDayFeeUSD || poolData?.oneDayFeeUntracked;
  const apr = getTradingFeeAPR(poolData?.reserveUSD, fee).toFixed(2);

  const currency0 = unwrappedToken(pair.token0);
  const currency1 = unwrappedToken(pair.token1);

  const userDefaultPoolBalance = useTokenBalance(
    account ?? undefined,
    pair.liquidityToken
  );
  const totalPoolTokens = useTotalSupply(pair.liquidityToken);

  // if staked balance balance provided, add to standard liquidity amount
  const userPoolBalance = stakedBalance
    ? userDefaultPoolBalance?.add(stakedBalance)
    : userDefaultPoolBalance;

  const poolTokenPercentage =
    !!userPoolBalance &&
    !!totalPoolTokens &&
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
      : undefined;

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance),
        ]
      : [undefined, undefined];

  const amp = new Fraction(pair.amp).divide(JSBI.BigInt(10000));

  const percentToken0 = pair.reserve0
    .divide(pair.virtualReserve0)
    .multiply('100')
    .divide(
      pair.reserve0
        .divide(pair.virtualReserve0)
        .add(pair.reserve1.divide(pair.virtualReserve1))
    );
  const percentToken1 = new Fraction(JSBI.BigInt(100), JSBI.BigInt(1)).subtract(
    percentToken0
  );

  const usdValue = getMyLiquidity(myLiquidity);

  const isWarning =
    percentToken0.lessThan(JSBI.BigInt(10)) ||
    percentToken1.lessThan(JSBI.BigInt(10));

  const warningToken = isWarning
    ? percentToken0.lessThan(JSBI.BigInt(10))
      ? pair.token0.symbol
      : pair.token1.symbol
    : undefined;

  const native0 = useCurrencyConvertedToNative(currency0 || undefined);
  const native1 = useCurrencyConvertedToNative(currency1 || undefined);

  const [showPoolInfo, setShowPoolInfo] = useState(false);

  return (
    <StyledPositionCard border={border}>
      {(isWarning || isFarmingPool) && (
        <IconWrapper>
          {isFarmingPool ? (
            <MouseoverTooltip text="Available for yield farming">
              <DropIcon height={40} width={40} />
            </MouseoverTooltip>
          ) : (
            <MouseoverTooltip
              text={
                warningToken ? (
                  <WarningMessage>{`Note: ${warningToken} is now <10% of the pool. Pool might become inactive if ${warningToken} reaches 0%`}</WarningMessage>
                ) : (
                  <WarningMessage>
                    One token is close to 0% in the pool ratio. Pool might go
                    inactive.
                  </WarningMessage>
                )
              }
            >
              <WarningLeftIcon height={40} width={40} />
            </MouseoverTooltip>
          )}
        </IconWrapper>
      )}

      <Flex justifyContent="center">
        <DoubleCurrencyLogo currency0={native0} currency1={native1} size={40} />
      </Flex>

      <Flex alignItems="center" justifyContent="center" marginTop="1rem">
        <span tw="text-xl font-medium">{`${native0?.symbol}/${native1?.symbol}`}</span>
        <span tw="text-xl font-medium ml-1">
          (AMP = {amp.toSignificant(5)})
        </span>
      </Flex>

      <Tabs>
        <TabItem
          active={!showPoolInfo}
          role="button"
          onClick={() => setShowPoolInfo(false)}
        >
          Your Liquidity
        </TabItem>
        <TabItem
          active={showPoolInfo}
          role="button"
          onClick={() => setShowPoolInfo(true)}
        >
          Pool Info
        </TabItem>
      </Tabs>

      <Flex
        flexDirection="column"
        height="108px"
        justifyContent="space-between"
        marginTop="14px"
      >
        {showPoolInfo ? (
          <>
            <Row>
              <Flex>
                Ratio
                <InfoHelper
                  size={14}
                  text={
                    'Current token pair ratio of the pool. Ratio changes depending on pool trades. Add liquidity according to this ratio.'
                  }
                />
              </Flex>
              <TokenRatioText
                fontSize={12}
                fontWeight={500}
                isWarning={isWarning}
              >
                {percentToken0.toSignificant(2) ?? '.'}% {pair.token0.symbol} -{' '}
                {percentToken1.toSignificant(2) ?? '.'}% {pair.token1.symbol}
              </TokenRatioText>
            </Row>
            <Row>
              <Flex>
                APR
                <InfoHelper
                  size={14}
                  text={'Estimated return based on yearly fees of the pool'}
                />
              </Flex>
              <span tw="text-xl">{apr ? `${apr}%` : '-'}</span>
            </Row>
            <Row>
              <span tw="text-xl">Volume (24H)</span>
              <span tw="text-xl">
                {volume ? formattedNum(volume, true) : '-'}
              </span>
            </Row>
            <Row>
              <span tw="text-xl">Fees (24H)</span>
              <span tw="text-xl">{fee ? formattedNum(fee, true) : '-'}</span>
            </Row>
          </>
        ) : (
          <>
            <Row>
              <span tw="text-xl">Your deposit</span>
              <span tw="text-xl">{usdValue}</span>
            </Row>
            <Row>
              <span tw="text-xl">Total LP Tokens</span>
              <span tw="text-xl">
                {userPoolBalance?.toSignificant(6) ?? '-'}
              </span>
            </Row>
            <Row>
              <span tw="text-xl">Pooled {native0?.symbol}</span>
              {token0Deposited ? (
                <RowFixed>
                  <CurrencyLogo currency={currency0} size="16px" />
                  <span tw="text-xl font-medium ml-1.5">
                    {token0Deposited?.toSignificant(6)}
                  </span>
                </RowFixed>
              ) : (
                '-'
              )}
            </Row>
            <Row>
              <span tw="text-xl">Pooled {native1?.symbol}</span>
              {token1Deposited ? (
                <RowFixed>
                  <CurrencyLogo currency={currency1} size="16px" />
                  <span tw="text-xl font-medium ml-1.5">
                    {token1Deposited?.toSignificant(6)}
                  </span>
                </RowFixed>
              ) : (
                '-'
              )}
            </Row>

            <Row>
              <span tw="text-xl">Your share of pool</span>
              <span tw="text-xl">
                {poolTokenPercentage
                  ? (poolTokenPercentage.toFixed(2) === '0.00'
                      ? '<0.01'
                      : poolTokenPercentage.toFixed(2)) + '%'
                  : '-'}
              </span>
            </Row>
          </>
        )}
      </Flex>

      <Divider sx={{ marginTop: '18px' }} />

      {/* <Flex alignItems="center" justifyContent="space-between" marginTop="16px"> */}
      {/* <ButtonEmpty
          padding="0"
          style={{ fontSize: '14px' }}
          width="max-content"
        >
          <a
            href={`${DMM_ANALYTICS_URL[chainId as ChainId]}/account/${account}`}
            style={{ textAlign: 'center', width: '100%' }}
          >
            Analytics ↗
          </a>
        </ButtonEmpty> */}

      <Flex justifyContent="flex-end">
        <ButtonLight
          padding="6px"
          style={{
            borderRadius: '4px',
            fontSize: '14px',
            marginRight: '8px',
          }}
          onClick={() => {
            setPage(DmmPage.ADDLIQUIDITY);
            setCurrencyIdA(currencyId(currency0, chainId));
            setCurrencyIdB(currencyId(currency1, chainId));
            setPairAddress(pair.address);
          }}
        >
          <span tw="text-xl w-max">+ Add</span>
        </ButtonLight>

        <RemoveBtn
          style={{
            borderRadius: '4px',
            fontSize: '14px',
            padding: '6px',
          }}
          onClick={() => {
            setPage(DmmPage.REMOVELIQUIDITY);
            setCurrencyIdA(currencyId(currency0, chainId));
            setCurrencyIdB(currencyId(currency1, chainId));
            setPairAddress(pair.address);
          }}
        >
          <span tw="text-xl w-max">- Remove</span>
        </RemoveBtn>
      </Flex>
      {/* </Flex> */}
    </StyledPositionCard>
  );
}
