import { JSBI, Pair, Percent } from '@rbl/velox-common/uniV2ClonesSDK';
import { useWeb3React } from '@romeblockchain/wallet';
import { darken } from 'polished';
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'react-feather';
import { Text } from 'rebass';
import styled from 'styled-components';
import tw from 'twin.macro';

import { ButtonSecondary } from '../../../../components/buttons';
import Card, { GreyCard } from '../../../../components/card';
import { AutoColumn } from '../../../../components/column';
import { RowBetween, RowFixed } from '../../../../components/row';
import {
  currencyId,
  getDefaultCurrencySymbol,
  unwrappedToken,
} from '../../../../utils';
import { useTotalSupply } from '../../data/TotalSupply';
import { useTokenBalance } from '../../state/wallet/hooks';
import CurrencyLogo from '../CurrencyLogo';
import DoubleCurrencyLogo from '../DoubleLogo';
import { Dots } from '../swap/styleds';

export const FixedHeightRow = styled(RowBetween)`
  height: 24px;
`;

const ResponsiveButtonSecondary = styled(ButtonSecondary)`
  width: 48%;
  ${tw`text-xl text-gray-300 font-medium my-2 bg-gray-500 px-5 py-2 rounded-lg hover:bg-dark-900 hover:text-yellow-400 hover:border-yellow-400`};
`;

export const HoverCard = styled(Card)`
  border: 1px solid ${({ theme }) => theme.bg2};
  :hover {
    border: 1px solid ${({ theme }) => darken(0.06, theme.bg2)};
  }
`;

interface PositionCardProps {
  pair: Pair;
  showUnwrapped?: boolean;
  border?: string;
  onRemoveLiquidity?: (currencyA: string, currencyB: string) => void;
  onAddLiquidity?: (currencyA?: string, currencyB?: string) => void;
}

export function MinimalPositionCard({
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

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
          pair.getLiquidityValue(
            pair.token0,
            totalPoolTokens,
            userPoolBalance,
            false
          ),
          pair.getLiquidityValue(
            pair.token1,
            totalPoolTokens,
            userPoolBalance,
            false
          ),
        ]
      : [undefined, undefined];

  return (
    <>
      {userPoolBalance && (
        <GreyCard border={border}>
          <AutoColumn gap="4px">
            <FixedHeightRow>
              <RowFixed>
                <span tw="text-xl font-medium">Your position</span>
              </RowFixed>
            </FixedHeightRow>
            <FixedHeightRow onClick={() => setShowMore(!showMore)}>
              <RowFixed>
                <DoubleCurrencyLogo
                  currency0={currency0}
                  currency1={currency1}
                  margin={true}
                  size={20}
                />
                <span tw="text-xl font-medium">
                  {getDefaultCurrencySymbol(currency0)}/
                  {getDefaultCurrencySymbol(currency1)}
                </span>
              </RowFixed>
              <RowFixed>
                <span tw="text-xl font-medium">
                  {userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}
                </span>
              </RowFixed>
            </FixedHeightRow>
            <AutoColumn gap="4px">
              <FixedHeightRow>
                <Text color="#888D9B" fontSize={12} fontWeight={500}>
                  {getDefaultCurrencySymbol(currency0)}:
                </Text>
                {token0Deposited ? (
                  <RowFixed>
                    <Text
                      color="#888D9B"
                      fontSize={12}
                      fontWeight={500}
                      marginLeft={'6px'}
                    >
                      {token0Deposited?.toSignificant(6)}
                    </Text>
                  </RowFixed>
                ) : (
                  '-'
                )}
              </FixedHeightRow>
              <FixedHeightRow>
                <Text color="#888D9B" fontSize={12} fontWeight={500}>
                  {getDefaultCurrencySymbol(currency1)}:
                </Text>
                {token1Deposited ? (
                  <RowFixed>
                    <Text
                      color="#888D9B"
                      fontSize={12}
                      fontWeight={500}
                      marginLeft={'6px'}
                    >
                      {token1Deposited?.toSignificant(6)}
                    </Text>
                  </RowFixed>
                ) : (
                  '-'
                )}
              </FixedHeightRow>
            </AutoColumn>
          </AutoColumn>
        </GreyCard>
      )}
    </>
  );
}

export default function FullPositionCard({
  border,
  onAddLiquidity,
  onRemoveLiquidity,
  pair,
}: PositionCardProps) {
  const { account } = useWeb3React();

  const currency0 = unwrappedToken(pair.token0);
  const currency1 = unwrappedToken(pair.token1);

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
          pair.getLiquidityValue(
            pair.token0,
            totalPoolTokens,
            userPoolBalance,
            false
          ),
          pair.getLiquidityValue(
            pair.token1,
            totalPoolTokens,
            userPoolBalance,
            false
          ),
        ]
      : [undefined, undefined];

  return (
    <HoverCard border={border}>
      <AutoColumn gap="12px">
        <FixedHeightRow
          style={{ cursor: 'pointer' }}
          onClick={() => setShowMore(!showMore)}
        >
          <RowFixed>
            <DoubleCurrencyLogo
              currency0={currency0}
              currency1={currency1}
              margin={true}
              size={20}
            />
            <span tw="text-xl font-medium">
              {!currency0 || !currency1 ? (
                <Dots>Loading</Dots>
              ) : (
                `${getDefaultCurrencySymbol(
                  currency0
                )}/${getDefaultCurrencySymbol(currency1)}`
              )}
            </span>
          </RowFixed>
          <RowFixed>
            {showMore ? (
              <ChevronUp size="20" style={{ marginLeft: '10px' }} />
            ) : (
              <ChevronDown size="20" style={{ marginLeft: '10px' }} />
            )}
          </RowFixed>
        </FixedHeightRow>
        {showMore && (
          <AutoColumn gap="8px">
            <FixedHeightRow>
              <RowFixed>
                <span tw="text-xl font-medium">
                  Pooled {getDefaultCurrencySymbol(currency0)}:
                </span>
              </RowFixed>
              {token0Deposited ? (
                <RowFixed>
                  <span tw="text-xl font-medium mr-2">
                    {token0Deposited?.toSignificant(6)}
                  </span>
                  <CurrencyLogo currency={currency0} size="20px" />
                </RowFixed>
              ) : (
                '-'
              )}
            </FixedHeightRow>

            <FixedHeightRow>
              <RowFixed>
                <span tw="text-xl font-medium">
                  Pooled {getDefaultCurrencySymbol(currency1)}:
                </span>
              </RowFixed>
              {token1Deposited ? (
                <RowFixed>
                  <span tw="text-xl font-medium">
                    {token1Deposited?.toSignificant(6)}
                  </span>
                  <CurrencyLogo
                    currency={currency1}
                    size="20px"
                    tw="ml-2"
                  />
                </RowFixed>
              ) : (
                '-'
              )}
            </FixedHeightRow>
            <FixedHeightRow>
              <span tw="text-xl font-medium">Your pool tokens:</span>
              <span tw="text-xl font-medium">
                {userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}
              </span>
            </FixedHeightRow>
            <FixedHeightRow>
              <span tw="text-xl font-medium">Your pool share:</span>
              <span tw="text-xl font-medium">
                {poolTokenPercentage
                  ? poolTokenPercentage.toFixed(2) + '%'
                  : '-'}
              </span>
            </FixedHeightRow>

            <RowBetween marginTop="10px">
              <ResponsiveButtonSecondary
                onClick={() =>
                  onAddLiquidity &&
                  onAddLiquidity(currencyId(currency0), currencyId(currency1))
                }
              >
                ADD
              </ResponsiveButtonSecondary>
              <ResponsiveButtonSecondary
                onClick={() =>
                  onRemoveLiquidity &&
                  onRemoveLiquidity(
                    currencyId(currency0),
                    currencyId(currency1)
                  )
                }
              >
                REMOVE
              </ResponsiveButtonSecondary>
            </RowBetween>
          </AutoColumn>
        )}
      </AutoColumn>
    </HoverCard>
  );
}
