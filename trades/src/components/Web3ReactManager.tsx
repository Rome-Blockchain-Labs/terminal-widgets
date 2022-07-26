import React, { FC, useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import styled from 'styled-components';
import { theme } from 'twin.macro';

import { useWallets } from '../contexts/WalletsContext/WalletContext';

const MessageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20rem;
`;

const Message = styled.h2`
  color: ${({ theme }) => theme.secondary1};
`;

const Web3ReactManager: FC = ({ children }) => {
  const { active, error } = useWallets();

  const [showLoader, setShowLoader] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLoader(true);
    }, 600);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  if (!active && error) {
    return (
      <MessageWrapper>
        <Message>{'unknownError'}</Message>
      </MessageWrapper>
    );
  }

  // if neither context is networkLogos, spin
  if (!active) {
    return showLoader ? (
      <MessageWrapper>
        <ClipLoader loading color={theme`colors.yellow.500`} size={16} />
      </MessageWrapper>
    ) : null;
  }

  return <>{children}</>;
};

export default Web3ReactManager;
