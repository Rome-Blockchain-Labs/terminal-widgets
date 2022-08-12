import { RomeEventType, widgetBridge } from '@romeblockchain/bridge';
import { Wallet } from '@romeblockchain/wallet';
import { MetaMask } from '@web3-react/metamask';
import { Network } from '@web3-react/network';
import { AddEthereumChainParameter } from '@web3-react/types';
import { WalletConnect } from '@web3-react/walletconnect';
import { ethers } from 'ethers';
import React, { FC } from 'react';
import tw, { styled } from 'twin.macro';

import { NetworkName } from '../../constants/networkExchange';
import { EventGroups } from '../GtagContext';

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
type WidgetBridge = typeof widgetBridge;

export const handleConnect = async (
  connector: MetaMask | WalletConnect | Network,
  setSelectedWallet: (wallet: Wallet) => void,
  wallet: Wallet,
  widgetBridge: WidgetBridge | null,
  chainParams?: number | AddEthereumChainParameter
) => {
  if (connector instanceof MetaMask) {
    let error;
    //Metamask will automatically add the network if doesnt no
    await connector.activate(chainParams).catch(() => (error = true));
    if (error) return;
  } else {
    if (typeof chainParams === 'number') {
      let error;

      await connector.activate(chainParams).catch(() => (error = true));
      if (error) return;
      connector.provider?.on('chainChanged', () => {
        setSelectedWallet(wallet);

        connector.provider?.removeListener('chainChanged', () => {});
      });
    } else {
      let error;
      // error would return true if user rejects the wallet connection request
      // if network doesnt exist yet connector.activate would not throw an error and still successsfully activate
      await connector
        .activate(chainParams && chainParams.chainId)
        .catch(() => (error = true));

      if (error) return;

      chainParams &&
        (await connector.provider?.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              ...chainParams,
              chainId: ethers.utils.hexValue(chainParams.chainId),
            },
          ],
        }));

      connector.provider?.on('chainChanged', () => {
        setSelectedWallet(wallet);

        connector.provider?.removeListener('chainChanged', () => {});
      });
    }
  }

  // If wallet is already connected to the correct network then set wallet as priority wallet
  const chainId = await connector.provider?.request<string | number>({
    method: 'eth_chainId',
  });

  if (!chainId) return;
  let targetChainId;
  if (typeof chainParams === 'number') {
    targetChainId = chainParams;
  } else {
    targetChainId = chainParams?.chainId;
  }

  if (targetChainId && chainId === ethers.utils.hexValue(targetChainId)) {
    setSelectedWallet(wallet);
  }
  if (targetChainId && chainId === targetChainId) {
    setSelectedWallet(wallet);
  }
  widgetBridge?.emit(RomeEventType.WIDGET_GOOGLE_ANALYTICS_EVENT, {
    event: `${wallet.replace(' ', '_')}_Successful_Connection`,
    eventGroup: EventGroups.WalletConnection,
  });
};
