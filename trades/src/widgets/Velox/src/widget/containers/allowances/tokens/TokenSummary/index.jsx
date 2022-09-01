import React from 'react';
import styled from 'styled-components';

import { TokenFont } from '../../../../assets/styled';
import TokenImage from '../../../../components/TokenImage';
import { withEnlargedProps } from '../../../../WidgetSizeStateContext';
import TokenExternalLink from './TokenExternalLink';
import TokenInfo from './TokenInfo';

const NonWrappable = styled.sup`
  white-space: nowrap;
`;
const NormalEllipsisedFont = styled(TokenFont)`
  font-size: 0.625rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 3.75rem;
  display: inline-block;
  vertical-align: middle;
`;

const EnlargedEllipsisedFont = styled(NormalEllipsisedFont)`
  font-size: 1.125rem;
`;

const EllipsisedFont = withEnlargedProps(
  NormalEllipsisedFont,
  EnlargedEllipsisedFont
);

const TokenSummaryWrapper = styled.div`
  @media only screen and (max-width: 47.938rem) {
    float: right;
  }

  img {
    display: inline-block;
  }
`;

export const TokenSummary = (props) => {
  const { price, token, volume } = props;
  return (
    <TokenSummaryWrapper>
      <TokenImage token={token} />{' '}
      <EllipsisedFont>{token.symbol}</EllipsisedFont>
      <NonWrappable>
        <TokenInfo price={price} token={token} volume={volume} />
        <TokenExternalLink token={token} />
      </NonWrappable>
    </TokenSummaryWrapper>
  );
};
export default TokenSummary;
