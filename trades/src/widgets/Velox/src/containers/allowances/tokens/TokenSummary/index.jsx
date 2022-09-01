import React from 'react';
import styled from 'styled-components';

import { TokenFont } from '../../../../assets/styled';
import TokenImage from '../../../../components/TokenImage';
import TokenExternalLink from './TokenExternalLink';
import TokenInfo from './TokenInfo';

const NonWrappable = styled.sup`
  white-space: nowrap;
`;
const EllipsisedFont = styled(TokenFont)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 60px;
  display: inline-block;
  vertical-align: middle;
`;

export const TokenSummary = (props) => {
  const { price, token, volume } = props;
  return (
    <>
      <TokenImage token={token} />{' '}
      <EllipsisedFont>{token.symbol}</EllipsisedFont>
      <NonWrappable>
        <TokenInfo price={price} token={token} volume={volume} />
        <TokenExternalLink token={token} />
      </NonWrappable>
    </>
  );
};
export default TokenSummary;
