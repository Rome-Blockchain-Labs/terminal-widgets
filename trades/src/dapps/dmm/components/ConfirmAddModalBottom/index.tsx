import {
  Currency,
  CurrencyAmount,
  Fraction,
  JSBI,
  Pair,
  Percent,
  Price,
} from '@dynamic-amm/sdk';
import React from 'react';
import { Flex, Text } from 'rebass';
import styled from 'styled-components';
import tw from 'twin.macro';

import { ONE_BIPS } from '../../constants/index';
import { Field } from '../../state/mint/actions';
import { formattedNum } from '../../utils';
import { useCurrencyConvertedToNative } from '../../utils/dmm';
import { ButtonPrimary } from '..//Button';
import CurrencyLogo from '..//CurrencyLogo';
import CurrentPrice from '..//CurrentPrice';
import { PoolPriceRangeBar } from '..//PoolPriceBar';
import { RowBetween, RowFixed } from '..//Row';
import FormattedPriceImpact from '../swap/FormattedPriceImpact';

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 24px;
  ${tw`border border-gray-400`}
`;

const CurrentPriceWrapper = styled.div`
  display: flex;
  flex-direction: column;

  @media only screen and (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

export function ConfirmAddModalBottom({
  amplification,
  currencies,
  estimatedUsd,
  noLiquidity,
  onAdd,
  pair,
  parsedAmounts,
  poolTokenPercentage,
  price,
  priceImpact,
}: {
  pair: Pair | null | undefined;
  noLiquidity?: boolean;
  price?: Price;
  currencies: { [field in Field]?: Currency };
  parsedAmounts: { [field in Field]?: CurrencyAmount };
  poolTokenPercentage?: Percent;
  onAdd: () => void;
  amplification?: Fraction;
  priceImpact?: Percent;
  estimatedUsd?: [number, number];
}) {
  const amp = !!pair
    ? new Fraction(pair.amp).divide(JSBI.BigInt(10000)).toSignificant(5)
    : amplification?.divide(JSBI.BigInt(10000)).toSignificant(5);
  const tokenA = useCurrencyConvertedToNative(
    currencies[Field.CURRENCY_A] as Currency
  );
  const tokenB = useCurrencyConvertedToNative(
    currencies[Field.CURRENCY_B] as Currency
  );

  return (
    <>
      <Section style={{ gap: '8px' }}>
        <RowBetween>
          <span tw="text-xl">Pooled {tokenA?.symbol}</span>
          <RowFixed>
            <CurrencyLogo
              currency={currencies[Field.CURRENCY_A]}
              style={{ marginRight: '8px' }}
            />
            <Flex alignItems="center">
              <span tw="text-xl">
                {parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}
              </span>
              {estimatedUsd && !!estimatedUsd[0] && (
                <Text fontSize={14} marginLeft="4px">
                  ({formattedNum(estimatedUsd[0].toString(), true) || undefined}
                  )
                </Text>
              )}
            </Flex>
          </RowFixed>
        </RowBetween>

        <RowBetween>
          <span tw="text-xl">Pooled {tokenB?.symbol}</span>
          <RowFixed>
            <CurrencyLogo
              currency={currencies[Field.CURRENCY_B]}
              style={{ marginRight: '8px' }}
            />
            <Flex alignItems="center">
              <span tw="text-xl">
                {parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}
              </span>

              {estimatedUsd && !!estimatedUsd[1] && (
                <Text fontSize={14} marginLeft="4px">
                  ({formattedNum(estimatedUsd[1].toString(), true) || undefined}
                  )
                </Text>
              )}
            </Flex>
          </RowFixed>
        </RowBetween>

        <CurrentPriceWrapper>
          <span tw="text-xl">Current Price</span>
          <span tw="text-xl">
            <CurrentPrice price={price} />
          </span>
        </CurrentPriceWrapper>

        <RowBetween>
          <span tw="text-xl">Your Share of Pool</span>
          <span tw="text-xl">
            {noLiquidity && price
              ? '100'
              : poolTokenPercentage && poolTokenPercentage.greaterThan('0')
              ? poolTokenPercentage?.lessThan(ONE_BIPS)
                ? '<0.01'
                : poolTokenPercentage?.toFixed(2)
              : '0'}
            %
          </span>
        </RowBetween>

        {priceImpact && (
          <RowBetween>
            <span tw="text-xl">Price Impact</span>
            <span tw="text-xl">
              <FormattedPriceImpact priceImpact={priceImpact} />
            </span>
          </RowBetween>
        )}
      </Section>

      {noLiquidity && (
        <Section>
          <span tw="text-xl">AMP{!!amp ? <>&nbsp;=&nbsp;{amp}</> : ''}</span>
          <PoolPriceRangeBar
            amplification={amplification}
            currencies={currencies}
            pair={pair}
            price={price}
          />
        </Section>
      )}

      <ButtonPrimary
        style={{ margin: '4px 0 0 0', padding: '16px' }}
        onClick={onAdd}
      >
        <span tw="text-xl font-medium">
          {noLiquidity ? 'Create Pool' : 'Confirm'}
        </span>
      </ButtonPrimary>
    </>
  );
}
