import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { useWallets } from '../../../../contexts/WalletsContext/WalletContext';
import Loader from '../Loader';

const MessageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20rem;
`;

const Message = styled.h2``;

export default function Web3ReactManager({
  children,
}: {
  children: JSX.Element;
}) {
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

  // if the account context isn't networkLogos, and there's an error on the network context, it's an irrecoverable error
  if (!active && error) {
    return (
      <MessageWrapper>
        <Message>
          Oops! An unknown error occurred. Please refresh the page, or visit
          from another browser or device.
        </Message>
      </MessageWrapper>
    );
  }

  // if neither context is networkLogos, spin
  if (!active && !error) {
    return showLoader ? (
      <MessageWrapper>
        <Loader />
      </MessageWrapper>
    ) : null;
  }

  return children;
}
