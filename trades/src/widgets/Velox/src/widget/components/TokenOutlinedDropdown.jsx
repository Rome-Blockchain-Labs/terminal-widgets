import React from 'react';
import styled from 'styled-components';

import { Outline } from '../assets/styled';
import { withEnlargedProps } from '../WidgetSizeStateContext';
import TokenDropdown from './TokenDropdown';

const NormalTokenDropdownOutline = styled(Outline)`
  background: #08333c;
  display: inline-block;
  height: 1.875rem;
  white-space: nowrap;
  width: 7.5rem;
  border-radius: 1.8rem;
`;

const EnlargedTokenDropdownOutline = styled(NormalTokenDropdownOutline)`
  font-size: 1.125rem;
  padding: 0.5rem;
  height: 3.75rem;
  width: 12.5rem;

  border-radius: 3.75rem;
`;

const TokenDropdownOutline = withEnlargedProps(
  NormalTokenDropdownOutline,
  EnlargedTokenDropdownOutline
);

const TokenOutlinedDropdown = (props) => {
  return (
    <TokenDropdownOutline>
      <TokenDropdown {...props} />
    </TokenDropdownOutline>
  );
};

export default TokenOutlinedDropdown;
