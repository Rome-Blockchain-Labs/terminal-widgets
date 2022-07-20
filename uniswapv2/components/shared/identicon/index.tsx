import Jazzicon from '@metamask/jazzicon';
import React, { useEffect, useRef } from 'react';
import tw, { styled } from 'twin.macro';

import { useWallets } from '../../contexts/WalletsContext/WalletContext';

const StyledIdenticonContainer = styled.div`
  ${tw`flex`}
  height: 1rem;
  width: 1rem;
  border-radius: 1.125rem;
`;

export default function Identicon({ size = 16 }: { size?: number }) {
  const ref = useRef<HTMLDivElement>();

  const { account } = useWallets();

  useEffect(() => {
    if (account && ref.current) {
      ref.current.innerHTML = '';
      ref.current.appendChild(
        Jazzicon(size, parseInt(account.slice(2, 10), size))
      );
    }
  }, [account, size]);

  // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451
  return (
    <StyledIdenticonContainer
      ref={ref as any}
      style={{
        height: `${size}px`,
        width: `${size}px`,
      }}
    />
  );
}
