import React from 'react';
import styled from 'styled-components';

import IconInfo from '../../../../../assets/icons/icon-info.svg';
import { PinkTooltip } from '../../../../components/Icons';

const NumericFont = styled.div`
  font-size: 0.625rem;
  font-family: 'Fira Code', monospace;
  text-align: center;
`;

const TokenInfo = (props) => {
  const { price, token, volume } = props;

  const formattedPrice = price?.toLocaleString('en-US', {
    currency: 'USD',
    style: 'currency',
  });

  return (
    <PinkTooltip
      title={
        <>
          {price !== undefined && <div>Price:{formattedPrice} USD</div>}
          {volume !== undefined && (
            <div>Volume:USD{parseInt(volume).toLocaleString()}</div>
          )}
          <NumericFont>Address: {token.id}</NumericFont>
        </>
      }
    >
      <img alt={'IconInfo'} src={IconInfo} width={20} />
    </PinkTooltip>
  );
};
export default TokenInfo;
