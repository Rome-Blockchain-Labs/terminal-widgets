import React from 'react';
import { AlertTriangle } from 'react-feather';
import styled from 'styled-components';
import tw from 'twin.macro';

export const ZapErrorWrapper = styled.div<{ warning?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 28px;

  font-size: 12px;
  font-weight: 400;
  ${tw`bg-red-700`}
`;

const ZapError = ({
  message,
  warning,
}: {
  message?: string;
  warning?: boolean;
}) => {
  return (
    <ZapErrorWrapper warning={warning}>
      <AlertTriangle size={16} style={{ strokeWidth: 1.5 }} />
      {message}
    </ZapErrorWrapper>
  );
};

export default ZapError;
