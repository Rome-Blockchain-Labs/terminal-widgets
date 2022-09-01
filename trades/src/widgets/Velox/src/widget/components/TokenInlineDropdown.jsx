import React from 'react';
import styled from 'styled-components';

import { withEnlargedProps } from '../WidgetSizeStateContext';
import TokenDropdown from './TokenDropdown';

const NormalTokenDropdownWrapper = styled.div`
  height: 1.875rem;
  white-space: nowrap;
`;

const EnlargedTokenDropdownWrapper = styled(NormalTokenDropdownWrapper)`
  height: 2.5rem;
  font-size: 1.125rem;
`;

const TokenDropdownWrapper = withEnlargedProps(
  NormalTokenDropdownWrapper,
  EnlargedTokenDropdownWrapper
);

const TokenInlineDropdown = (props) => {
  return (
    <TokenDropdownWrapper>
      <TokenDropdown {...props} />
    </TokenDropdownWrapper>
  );
};

export default TokenInlineDropdown;
