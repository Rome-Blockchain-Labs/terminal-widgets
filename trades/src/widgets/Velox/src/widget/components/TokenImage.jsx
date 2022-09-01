import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import {
  useWidgetSizeState,
  withEnlargedProps,
} from '../WidgetSizeStateContext';

const NormalMockToken = styled.div`
  vertical-align: middle;
  text-align: center;
  width: 1.375rem;
  height: 1.375rem;
  margin: 0.125rem;
  line-height: 1.375rem;
  box-shadow: 0 0 0 0.125rem #15b3b0;
  border-radius: 50%;
  display: inline-block;
  color: #b1cacb;
  font-size: 0.5rem;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background: #08333c;
`;

const EnlargedMockToken = styled(NormalMockToken)`
  width: 2.188rem;
  height: 2.188rem;
  line-height: 2.188rem;

  font-size: 0.625rem;
`;

const MockToken = withEnlargedProps(NormalMockToken, EnlargedMockToken);

const TokenImage = (props) => {
  const { token } = props;
  const { image, symbol } = token;
  const [error, setError] = useState(false);
  const widgetSizeState = useWidgetSizeState();

  const imageWidth = widgetSizeState.enlarged ? '2.188rem' : '1.375rem';

  useEffect(() => {
    setError(false);
  }, [image]);

  if (error || !image) {
    return <MockToken>{symbol}</MockToken>;
  }

  return (
    <img
      alt={symbol}
      src={image}
      style={{ borderRadius: '50%', margin: '.125rem', width: imageWidth }}
      onError={(err) => setError(true)}
    />
  );
};
export default TokenImage;
