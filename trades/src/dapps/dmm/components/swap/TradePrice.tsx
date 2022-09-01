import { Currency, Price } from '@dynamic-amm/sdk';
import React from 'react';
import { Repeat } from 'react-feather';
import { Text } from 'rebass';

import { useCurrencyConvertedToNative } from '../../utils/dmm';
import { StyledBalanceMaxMini } from './styleds';

interface TradePriceProps {
  price?: Price;
  showInverted: boolean;
  setShowInverted: (showInverted: boolean) => void;
}

export default function TradePrice({
  price,
  setShowInverted,
  showInverted,
}: TradePriceProps) {
  const formattedPrice = showInverted
    ? price?.toSignificant(6)
    : price?.invert()?.toSignificant(6);

  const show = Boolean(price?.baseCurrency && price?.quoteCurrency);
  const nativeQuote = useCurrencyConvertedToNative(
    price?.quoteCurrency as Currency
  );
  const nativeBase = useCurrencyConvertedToNative(
    price?.baseCurrency as Currency
  );
  const label = showInverted
    ? `${nativeQuote?.symbol} = 1 ${nativeBase?.symbol}`
    : `${nativeBase?.symbol} = 1 ${nativeQuote?.symbol}`;

  return (
    <Text
      fontSize={12}
      fontWeight={500}
      style={{ alignItems: 'center', cursor: 'pointer', display: 'flex' }}
      onClick={() => setShowInverted(!showInverted)}
    >
      {show ? (
        <>
          {formattedPrice ?? '-'} {label}
          <StyledBalanceMaxMini>
            <Repeat size={12} />
          </StyledBalanceMaxMini>
        </>
      ) : (
        '-'
      )}
    </Text>
  );
}
