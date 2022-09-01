import React from 'react';
import { CheckCircle, Copy } from 'react-feather';
import styled from 'styled-components';

import useCopyClipboard from '../../hooks/useCopyClipboard';

const CopyIcon = styled.div`
  flex-shrink: 0;
  margin-right: 1rem;
  margin-left: 2px;
  text-decoration: none;
  :hover,
  :active,
  :focus {
    text-decoration: none;
    opacity: 0.8;
    cursor: pointer;
  }
`;
const TransactionStatusText = styled.span`
  align-items: center;
`;

export default function CopyHelper({
  toCopy,
}: {
  toCopy: string;
  children?: React.ReactNode;
}) {
  const [isCopied, setCopied] = useCopyClipboard();

  return (
    <CopyIcon onClick={() => setCopied(toCopy)}>
      {isCopied ? (
        <TransactionStatusText>
          <CheckCircle size={'14'} />
        </TransactionStatusText>
      ) : (
        <TransactionStatusText>
          <Copy size={'14'} />
        </TransactionStatusText>
      )}
    </CopyIcon>
  );
}
