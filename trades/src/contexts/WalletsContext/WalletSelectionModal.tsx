import React, { FC } from 'react';
import tw, { styled } from 'twin.macro';

import { NetworkName } from '../../constants/networkExchange';

const HoverContainer = styled.div<{ active: boolean }>`
  ${tw`flex items-center w-28 h-28 rounded border border-solid  p-3 cursor-pointer justify-center text-center text-lg hover:bg-gray-400 hover:font-bold  grayscale-0 transition m-5`}

  ${({ active }) => (active ? tw`border-yellow-400` : tw`border-gray-400`)}
`;

const HoverBox: FC<{
  active: boolean;
  text: string;
  onClick: () => void;
  networkName?: NetworkName;
  promptingNetworkChange?: Array<NetworkName> | boolean;
}> = (props) => {
  const { active, networkName, onClick, promptingNetworkChange, text } = props;

  const hasNetworkWhitelist = typeof promptingNetworkChange === 'object';
  const excludedByNetworkWhitelist =
    hasNetworkWhitelist &&
    !promptingNetworkChange.some((n) => n === networkName);

  if (excludedByNetworkWhitelist) {
    return null;
  }

  return (
    <HoverContainer active={active} onClick={onClick}>
      <div>
        <div tw="m-auto mb-3 w-auto max-w-min">{props.children}</div>
        <div tw="leading-4">{text}</div>
      </div>
    </HoverContainer>
  );
};

export const WalletBox: FC<{
  isActive: boolean;
  walletName: string;
  connectHandler: () => void;
}> = (props) => {
  const { connectHandler, isActive, walletName } = props;
  return (
    <HoverBox
      active={isActive}
      text={walletName.toUpperCase().replaceAll('_', ' ')}
      onClick={connectHandler}
    >
      {props.children}
    </HoverBox>
  );
};
