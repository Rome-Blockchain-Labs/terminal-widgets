import 'twin.macro';

import {
  Currency,
  CurrencyAmount,
  Fraction,
  Percent,
} from '@rbl/velox-common/uniV2ClonesSDK';
import React from 'react';

import { ButtonPrimary } from '../../../../components/buttons';
import { RowBetween, RowFixed } from '../../../../components/row';
import CurrencyLogo from '../../components/CurrencyLogo';
import { Field } from '../../state/mint/actions';

export function ConfirmAddModalBottom({
  currencies,
  noLiquidity,
  onAdd,
  parsedAmounts,
  poolTokenPercentage,
  price,
}: {
  noLiquidity?: boolean;
  price?: Fraction;
  currencies: { [field in Field]?: Currency };
  parsedAmounts: { [field in Field]?: CurrencyAmount };
  poolTokenPercentage?: Percent;
  onAdd: () => void;
}) {
  return (
    <>
      <RowBetween>
        <span tw="text-xl font-medium">
          {currencies[Field.CURRENCY_A]?.symbol} Deposited
        </span>
        <RowFixed>
          <CurrencyLogo currency={currencies[Field.CURRENCY_A]} />
          <span tw="text-xl font-medium ml-2">
            {parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}
          </span>
        </RowFixed>
      </RowBetween>
      <RowBetween>
        <span tw="text-xl font-medium">
          {currencies[Field.CURRENCY_B]?.symbol} Deposited
        </span>
        <RowFixed>
          <CurrencyLogo
            currency={currencies[Field.CURRENCY_B]}
            style={{ marginRight: '8px' }}
          />
          <span tw="text-xl font-medium">
            {parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}
          </span>
        </RowFixed>
      </RowBetween>
      <RowBetween>
        <span tw="text-xl font-medium">Rates</span>
        <span tw="text-xl font-medium">
          {`1 ${currencies[Field.CURRENCY_A]?.symbol} = ${price?.toSignificant(
            4
          )} ${currencies[Field.CURRENCY_B]?.symbol}`}
        </span>
      </RowBetween>
      <RowBetween style={{ justifyContent: 'flex-end' }}>
        <span tw="text-xl font-medium">
          {`1 ${currencies[Field.CURRENCY_B]?.symbol} = ${price
            ?.invert()
            .toSignificant(4)} ${currencies[Field.CURRENCY_A]?.symbol}`}
        </span>
      </RowBetween>
      <RowBetween>
        <span tw="text-xl font-medium">Share of Pool:</span>
        <span tw="text-xl font-medium">
          {noLiquidity ? '100' : poolTokenPercentage?.toSignificant(4)}%
        </span>
      </RowBetween>
      <ButtonPrimary style={{ margin: '20px 0 0 0' }} onClick={onAdd}>
        <span tw="text-xl font-medium">
          {noLiquidity ? 'CREATE POOL & SUPPLY' : 'CONFIRM SUPPLY'}
        </span>
      </ButtonPrimary>
    </>
  );
}
