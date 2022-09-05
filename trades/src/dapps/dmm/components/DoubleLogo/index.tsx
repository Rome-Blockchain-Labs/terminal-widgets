import { Currency } from '@dynamic-amm/sdk';
import React from 'react';
import styled from 'styled-components';

import CurrencyLogo from '../CurrencyLogo';

const Wrapper = styled.div<{ margin: boolean; sizeraw: number }>`
  position: relative;
  display: flex;
  flex-direction: row;
  margin-right: ${({ margin, sizeraw }) =>
    margin && (sizeraw / 3 + 8).toString() + 'px'};
`;

interface DoubleCurrencyLogoProps {
  margin?: boolean;
  size?: number;
  currency0?: Currency;
  currency1?: Currency;
}

const HigherLogo = styled(CurrencyLogo)`
  z-index: 2;
`;
const CoveredLogo = styled(CurrencyLogo)<{ sizeraw: number }>`
  position: absolute;
  left: ${({ sizeraw }) => '-' + (sizeraw / 2).toString() + 'px'} !important;
`;

export default function DoubleCurrencyLogo({
  currency0,
  currency1,
  margin = false,
  size = 16,
}: DoubleCurrencyLogoProps) {
  return (
    <Wrapper margin={margin} sizeraw={size}>
      {currency0 && (
        <HigherLogo currency={currency0} size={size.toString() + 'px'} />
      )}
      {currency1 && (
        <CoveredLogo
          currency={currency1}
          size={size.toString() + 'px'}
          sizeraw={size}
        />
      )}
    </Wrapper>
  );
}
