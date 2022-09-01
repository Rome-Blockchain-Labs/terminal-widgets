import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const MockToken = styled.div`
  vertical-align: middle;
  text-align: center;
  width: 37px;
  height: 37px;
  margin: 2px;
  line-height: 37px;
  box-shadow: 0 0 0 2px #15b3b0;
  border-radius: 50%;
  display: inline-block;
  color: #b1cacb;
  font-size: 8px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background: #05595a;
`;

const TokenImage = (props) => {
  const { token } = props;
  const { image, symbol } = token;
  const [error, setError] = useState(false);
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
      style={{ borderRadius: '50%', margin: '2px', width: '31px' }}
      onError={(err) => setError(true)}
    />
  );
};
export default TokenImage;
