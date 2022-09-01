import React from 'react';
import styled from 'styled-components';

import { Outline } from '../assets/styled';
import TokenImage from './TokenImage';
const Ellipsis = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100px;
`;

const TokenDropdown = (props) => {
  const { token } = props;

  return (
    <Outline
      style={{
        backgroundColor: '#05595A',
        display: 'inline-block',
        whiteSpace: 'nowrap',
        width: '170px',
      }}
    >
      <div style={{ display: 'inline-block', verticalAlign: 'top' }}>
        <TokenImage token={token} />
      </div>
      <div style={{ display: 'inline-block', margin: '0 0 0 3px' }}>
        <div style={{ fontWeight: 'bold', margin: '3px 0 -6px' }}>
          <Ellipsis>{token.symbol}</Ellipsis>
        </div>
        <Ellipsis style={{ margin: '0 0 -3px 0' }}>{token.name}</Ellipsis>
      </div>
    </Outline>
  );
};
export default TokenDropdown;
