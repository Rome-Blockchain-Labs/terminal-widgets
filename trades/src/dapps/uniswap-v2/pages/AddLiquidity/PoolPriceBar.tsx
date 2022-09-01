import 'twin.macro';

import { Currency, Percent, Price } from '@rbl/velox-common/uniV2ClonesSDK';
import React from 'react';

import { ONE_BIPS } from '../../../../constants';
import { Field } from '../../state/mint/actions';

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
}) {
  return (
    <div tw="h-full flex flex-col bg-dark-600 rounded-xl text-lg py-10 px-5 text-center">
      <div tw="text-xl font-bold text-gray-100 mb-1">
        {price?.toSignificant(6) ?? '-'}
      </div>
      <div tw="text-gray-300">
        <strong>{currencies[Field.CURRENCY_B]?.symbol}</strong> per{' '}
        <strong>{currencies[Field.CURRENCY_A]?.symbol}</strong>
      </div>
      <div tw="flex-grow items-center flex">
        <div>
          <div tw="text-xl font-bold text-gray-100 mb-1">
            {price?.invert()?.toSignificant(6) ?? '-'}
          </div>
          <div tw="text-gray-300">
            <strong>{currencies[Field.CURRENCY_A]?.symbol}</strong> per{' '}
            <strong>{currencies[Field.CURRENCY_B]?.symbol}</strong>
          </div>
        </div>
      </div>
      <div tw="text-xl font-bold text-gray-100 mb-1">
        {noLiquidity && price
          ? '100'
          : (poolTokenPercentage?.lessThan(ONE_BIPS)
              ? '<0.01'
              : poolTokenPercentage?.toFixed(2)) ?? '0'}
        %
      </div>
      <div tw="text-gray-300">Share of Pool</div>
    </div>
  );
}
