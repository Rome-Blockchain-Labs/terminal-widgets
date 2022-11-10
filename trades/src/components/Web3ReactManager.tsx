import { useWeb3React } from '@romeblockchain/wallet';
import React, { FC, useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import styled from 'styled-components';
import { theme } from 'twin.macro';

const MessageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20rem;
`;

const Web3ReactManager: FC = ({ children }) => {
  const { isActive: active } = useWeb3React();

  const [showLoader, setShowLoader] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLoader(true);
    }, 600);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

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
