import { Price } from '@rbl/velox-common/uniV2ClonesSDK';
import React from 'react';
import { Repeat } from 'react-feather';
import { Text } from 'rebass';

import { getDefaultCurrencySymbol } from '../../../../utils';
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
  const label = showInverted
    ? `${getDefaultCurrencySymbol(
        price?.quoteCurrency
      )} per ${getDefaultCurrencySymbol(price?.baseCurrency)}`
    : `${getDefaultCurrencySymbol(
        price?.baseCurrency
      )} per ${getDefaultCurrencySymbol(price?.quoteCurrency)}`;

  return (
    <Text
      color={'#FFF'}
      fontSize={12}
      fontWeight={500}
      style={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      {show ? (
        <>
          {formattedPrice ?? '-'} {label}
          <StyledBalanceMaxMini onClick={() => setShowInverted(!showInverted)}>
            <Repeat size={12} />
          </StyledBalanceMaxMini>
        </>
      ) : (
        '-'
      )}
    </Text>
  );
}
