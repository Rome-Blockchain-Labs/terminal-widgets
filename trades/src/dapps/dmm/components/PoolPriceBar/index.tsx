import 'twin.macro';

import {
  Currency,
  Fraction,
  JSBI,
  Pair,
  Percent,
  Price,
} from '@dynamic-amm/sdk';
import React, { ReactNode } from 'react';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'react-feather';
import styled from 'styled-components';

import { AutoColumn } from '../../components/Column';
import { AutoRow, RowBetween, RowFixed } from '../../components/Row';
import { ONE_BIPS } from '../../constants';
import { Field } from '../../state/mint/actions';
import {
  priceRangeCalc,
  priceRangeCalcByPair,
  useCurrencyConvertedToNative,
} from '../../utils/dmm';
import { ButtonEmpty } from '../Button';
import Card from '../Card';
import QuestionHelper from '../QuestionHelper';

const DEFAULT_MIN_PRICE = '0.00';
const DEFAULT_MAX_PRICE = '♾️';

const Section = styled(Card)`
  padding: 16px;
  border-radius: 8px;
`;

const OutlineCard3 = styled(Section)`
  text-align: left;
`;

const ChevronUp2 = styled(ChevronUp)``;
const ChevronDown2 = styled(ChevronDown)``;

export const Separator = styled.div`
  width: 100%;
  height: 1px;
`;

const PoolPriceBarWrapper = styled.div<{ isAdd?: boolean }>`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 8px;

  @media only screen and (min-width: 1000px) {
    grid-template-columns: ${({ isAdd }) => (isAdd ? '1fr' : 'repeat(3, 1fr)')};
  }
`;

const PoolPriceBarItem = styled.div<{ isAdd?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media only screen and (min-width: 1000px) {
    flex-direction: ${({ isAdd }) => (isAdd ? 'row' : 'column-reverse')};
  }
`;

export const DefaultPriceRange = () => {
  return (
    <>
      <span tw="text-xl">Max: {DEFAULT_MAX_PRICE}</span>
      <span tw="text-xl">Min: {DEFAULT_MIN_PRICE}</span>
    </>
  );
};

export const InvalidAMPPriceRange = () => {
  return (
    <>
      <span tw="text-xl">-</span>
      <span tw="text-xl">-</span>
    </>
  );
};

export function PoolPriceBar({
  currencies,
  noLiquidity,
  poolTokenPercentage,
  price,
}: {
  currencies: { [field in Field]?: Currency };
  noLiquidity?: boolean;
  poolTokenPercentage?: Percent;
  price?: Price;
  pair: Pair | null | undefined;
}) {
  const nativeA = useCurrencyConvertedToNative(
    currencies[Field.CURRENCY_A] as Currency
  );
  const nativeB = useCurrencyConvertedToNative(
    currencies[Field.CURRENCY_B] as Currency
  );

  return (
    <PoolPriceBarWrapper isAdd={!noLiquidity}>
      {noLiquidity && (
        <>
          <PoolPriceBarItem>
            <span tw="text-base mb-1">
              {nativeB?.symbol} per {nativeA?.symbol}
            </span>
            <span tw="text-base">{price?.toSignificant(6) ?? '-'}</span>
          </PoolPriceBarItem>

          <PoolPriceBarItem>
            <span tw="text-base mb-1">
              {nativeA?.symbol} per {nativeB?.symbol}
            </span>
            <span tw="text-base">
              {price?.invert()?.toSignificant(6) ?? '-'}
            </span>
          </PoolPriceBarItem>
        </>
      )}

      <PoolPriceBarItem isAdd={!noLiquidity}>
        <span tw="text-base mb-1">
          {noLiquidity ? 'Share of Pool' : 'Your Share of Pool'}
        </span>
        <span tw="text-base">
          {noLiquidity && price
            ? '100'
            : poolTokenPercentage && poolTokenPercentage.greaterThan('0')
            ? poolTokenPercentage?.lessThan(ONE_BIPS)
              ? '<0.01'
              : poolTokenPercentage?.toFixed(2)
            : '0'}
          %
        </span>
      </PoolPriceBarItem>
    </PoolPriceBarWrapper>
  );
}

export function ToggleComponent({
  children,
  question = '',
  title = '',
}: {
  children: ReactNode;
  title: string;
  question?: string;
}) {
  const [showDetails, setShowDetails] = useState(true);
  return (
    <>
      <RowBetween
        style={{
          paddingBottom: '14px',
        }}
      >
        <AutoRow>
          <span tw="text-xl font-medium">{title}</span>
          {question && <QuestionHelper text={question} />}
        </AutoRow>
        <RowFixed gap="8px">
          <ButtonEmpty
            borderRadius="12px"
            padding="6px 8px"
            width="fit-content"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? (
              <ChevronUp2 size="20" style={{ marginLeft: '10px' }} />
            ) : (
              <ChevronDown2 size="20" style={{ marginLeft: '10px' }} />
            )}
          </ButtonEmpty>
        </RowFixed>
      </RowBetween>
      {showDetails && <>{children}</>}
    </>
  );
}

export function PoolPriceRangeBarToggle({
  amplification,
  currencies,
  pair,
  price,
}: {
  currencies: { [field in Field]?: Currency };
  price?: Price | Fraction;
  pair: Pair | null | undefined;
  amplification?: Fraction;
}) {
  return (
    <OutlineCard3>
      <ToggleComponent
        question={
          'Tradable token pair price range for this pool based on AMP. If the price goes below or above this range, the pool may become inactive.'
        }
        title={'Active Price Range'}
      >
        <PoolPriceRangeBar
          amplification={amplification}
          currencies={currencies}
          pair={pair}
          price={price}
        />
      </ToggleComponent>
    </OutlineCard3>
  );
}

export function PoolPriceRangeBar({
  amplification,
  currencies,
  pair,
  price,
}: {
  currencies: { [field in Field]?: Currency };
  price?: Price | Fraction;
  pair: Pair | null | undefined;
  amplification?: Fraction;
}) {
  const nativeA = useCurrencyConvertedToNative(
    currencies[Field.CURRENCY_A] as Currency
  );
  const nativeB = useCurrencyConvertedToNative(
    currencies[Field.CURRENCY_B] as Currency
  );

  const existedPriceRange = () => {
    const amp = amplification?.divide(JSBI.BigInt(10000));
    const show = !!pair && !!priceRangeCalcByPair(pair)[0][0];
    return (
      <AutoColumn gap="md">
        <AutoRow gap="4px" justify="space-between">
          <AutoColumn gap="4px">
            <span tw="text-xl pt-1 font-medium">
              {nativeB?.symbol} Per {nativeA?.symbol}
            </span>
            {!amp || amp.lessThan('1') ? (
              <InvalidAMPPriceRange />
            ) : show && !!pair ? (
              <>
                <span tw="text-xl">
                  Max:{' '}
                  {priceRangeCalcByPair(pair)[
                    currencies[Field.CURRENCY_A]?.symbol === pair.token0.symbol
                      ? 0
                      : 1
                  ][1]?.toSignificant(6) ?? '-'}
                </span>
                <span tw="text-xl">
                  Min:{' '}
                  {priceRangeCalcByPair(pair)[
                    currencies[Field.CURRENCY_A]?.symbol === pair.token0.symbol
                      ? 0
                      : 1
                  ][0]?.toSignificant(6) ?? '-'}
                </span>
              </>
            ) : (
              <DefaultPriceRange />
            )}
          </AutoColumn>
          <AutoColumn gap="4px" justify="end">
            <span tw="text-xl font-medium pt-1">
              {nativeA?.symbol} Per {nativeB?.symbol}
            </span>
            {!amp || amp.lessThan('1') ? (
              <InvalidAMPPriceRange />
            ) : show && !!pair ? (
              <>
                <span tw="text-xl">
                  Max:{' '}
                  {priceRangeCalcByPair(pair)[
                    currencies[Field.CURRENCY_A]?.symbol === pair.token0.symbol
                      ? 1
                      : 0
                  ][1]?.toSignificant(6) ?? '-'}
                </span>
                <span tw="text-xl">
                  Min:{' '}
                  {priceRangeCalcByPair(pair)[
                    currencies[Field.CURRENCY_A]?.symbol === pair.token0.symbol
                      ? 1
                      : 0
                  ][0]?.toSignificant(6) ?? '-'}
                </span>
              </>
            ) : (
              <DefaultPriceRange />
            )}
          </AutoColumn>
        </AutoRow>
      </AutoColumn>
    );
  };

  const newPriceRange = () => {
    const amp = amplification?.divide(JSBI.BigInt(10000));
    const show = !!priceRangeCalc(price, amp)[0];
    return (
      <AutoColumn gap="md">
        <AutoRow gap="4px" justify="space-between">
          <AutoColumn gap="sm">
            <span tw="text-xl font-medium pt-1">
              {nativeB?.symbol} Per {nativeA?.symbol}
            </span>
            {!amp || amp.lessThan('1') ? (
              <InvalidAMPPriceRange />
            ) : show ? (
              <>
                <span tw="text-xl">
                  Max: {priceRangeCalc(price, amp)[0]?.toSignificant(6) ?? '-'}
                </span>
                <span tw="text-xl">
                  Min: {priceRangeCalc(price, amp)[1]?.toSignificant(6) ?? '-'}
                </span>
              </>
            ) : (
              <DefaultPriceRange />
            )}
          </AutoColumn>
          <AutoColumn gap="sm" justify="end">
            <span tw="text-xl font-medium pt-1">
              {nativeA?.symbol} Per {nativeB?.symbol}
            </span>
            {!amp || amp.lessThan('1') ? (
              <InvalidAMPPriceRange />
            ) : show ? (
              <>
                <span tw="text-xl">
                  Max:{' '}
                  {priceRangeCalc(price?.invert(), amp)[0]?.toSignificant(6) ??
                    '-'}
                </span>
                <span tw="text-xl">
                  Min:{' '}
                  {priceRangeCalc(price?.invert(), amp)[1]?.toSignificant(6) ??
                    '-'}
                </span>
              </>
            ) : (
              <DefaultPriceRange />
            )}
          </AutoColumn>
        </AutoRow>
      </AutoColumn>
    );
  };

  return <>{!!pair ? existedPriceRange() : newPriceRange()}</>;
}
