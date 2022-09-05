import React from 'react';
import styled from 'styled-components';

import { withEnlargedProps } from '../WidgetSizeStateContext';
import TokenImage from './TokenImage';

const Ellipsis = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const NormalTokenSymbol = styled(Ellipsis)`
  font-weight: bold;
  font-size: ${(props) => (props.enlarged ? '1.125rem' : '.875rem')};
`;
const TokenSymbol = withEnlargedProps(NormalTokenSymbol);

const NormalTokenName = styled(Ellipsis)`
  font-size: ${(props) => (props.enlarged ? '.938rem' : '.625rem')};
`;
const TokenName = withEnlargedProps(NormalTokenName);

const TokenDropdown = (props) => {
  const { token } = props;

  return (
    <>
      <div style={{ display: 'inline-block', verticalAlign: 'top' }}>
        <TokenImage token={token} />
      </div>
      <div
        style={{
          display: 'inline-block',
          lineHeight: '1em',
          margin: '.3rem 0 0 .3rem',
        }}
      >
        <div style={{ fontWeight: 'bold' }}>
          <TokenSymbol>{token.symbol}</TokenSymbol>
        </div>
        <div style={{ margin: '0 0 0' }}>
          <TokenName>{token.name}</TokenName>
        </div>
      </div>
    </>
  );
};

export default TokenDropdown;
