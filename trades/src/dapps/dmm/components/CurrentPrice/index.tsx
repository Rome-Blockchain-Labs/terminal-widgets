import { Currency, Price } from '@dynamic-amm/sdk';
import React, { useState } from 'react';

import { useCurrencyConvertedToNative } from '../../utils/dmm';
import { ButtonEmpty } from '../Button';
import SwitchIcon from '../Icons/SwitchIcon';

interface CurrentPriceProps {
  price?: Price;
}

export default function CurrentPrice({ price }: CurrentPriceProps) {
  const [showInverted, setShowInverted] = useState<boolean>(false);

  const formattedPrice = showInverted
    ? price?.toSignificant(4)
    : price?.invert()?.toSignificant(4);

  const show = Boolean(price?.baseCurrency && price?.quoteCurrency);
  const nativeQuote = useCurrencyConvertedToNative(
    price?.quoteCurrency as Currency
  );
  const nativeBase = useCurrencyConvertedToNative(
    price?.baseCurrency as Currency
  );
  const label = showInverted
    ? `1 ${nativeBase?.symbol} = ${formattedPrice ?? '-'} ${
        nativeQuote?.symbol
      }`
    : `1 ${nativeQuote?.symbol} = ${formattedPrice ?? '-'} ${
        nativeBase?.symbol
      }`;

  return (
    <span>
      {show ? (
        <div style={{ alignItems: 'center', display: 'flex' }}>
          <div style={{ marginRight: '4px' }}>{label}</div>
          <ButtonEmpty
            padding="0"
            width="fit-content"
            onClick={() => setShowInverted && setShowInverted(!showInverted)}
          >
            <SwitchIcon />
          </ButtonEmpty>
        </div>
      ) : (
        '-'
      )}
    </span>
  );
}
