import { FC, useCallback, useRef, useState } from 'react';
import tw, { styled } from 'twin.macro';
import useOnClickOutside from 'use-onclickoutside';

import { NetworkName } from '../../constants/networkExchange';
import { Network } from '../../types';
import { Avalanche2Icon, Binance2Icon } from '../icons';

type DropdownNetworkInputProps = {
  onSelect?: (network: NetworkName) => void;
  blockchain?: NetworkName;
};

const DropdownWrapper = styled.div`
  ${tw`absolute top-full left-0 bg-gray-500  pb-1 flex flex-col justify-center whitespace-nowrap min-w-full z-50`}

  &::-webkit-scrollbar-thumb {
    ${tw`bg-gray-500 rounded-md border-2 border-solid border-gray-400`}
  }
  &::-webkit-scrollbar-track {
    ${tw`bg-gray-400 rounded-lg`}
  }
`;

const networks: Network[] = [
  {
    icon: <Avalanche2Icon height={12} width={12} />,
    id: NetworkName.AVALANCHE,
    name: 'AVALANCHE',
  },
  {
    icon: <Binance2Icon height={12} width={12} />,
    id: NetworkName.BINANCE,
    name: 'BINANCE',
  },
  // {
  //   icon: <Polkadot2Icon height={12} width={12} />,
  //   id: BlockchainNetwork.POLKADOT,
  //   name: 'POLKADOT',
  // },
  // {
  //   icon: <Ethereum2Icon height={12} width={12} />,
  //   id: BlockchainNetwork.ETHEREUM,
  //   name: 'ETHEREUM',
  // },
  // {
  //   icon: <Solana2Icon height={12} width={12} />,
  //   id: BlockchainNetwork.SOLANA,
  //   name: 'SOLANA',
  // },

  // {
  //   icon: <Stellar2Icon height={12} width={12} />,
  //   id: BlockchainNetwork.STELLAR,
  //   name: 'STELLAR',
  // },
  // {
  //   icon: <Tron2Icon height={12} width={12} />,
  //   id: BlockchainNetwork.TRON,
  //   name: 'TRON',
  // },
  // {
  //   icon: <Eos2Icon height={12} width={12} />,
  //   id: BlockchainNetwork.EOS,
  //   name: 'EOS',
  // },
  // {
  //   icon: <Tezos2Icon height={12} width={12} />,
  //   id: BlockchainNetwork.TEZOS,
  //   name: 'TEZOS',
  // },
  // {
  //   icon: <Cardano2Icon height={12} width={12} />,
  //   id: BlockchainNetwork.CARDANO,
  //   name: 'CARDANO',
  // },
  // {
  //   icon: <Cosmos2Icon height={12} width={12} />,
  //   id: BlockchainNetwork.COSMOS,
  //   name: 'COSMOS',
  // },
  // {
  //   icon: <Nuls2Icon height={12} width={12} />,
  //   id: BlockchainNetwork.NULS,
  //   name: 'NULS',
  // },
];

export const DropdownNetworkInput: FC<DropdownNetworkInputProps> = ({
  blockchain = NetworkName.AVALANCHE,
  onSelect,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isDropdownOpened, setIsDropdownOpened] = useState(false);
  const [activeNetwork, setActiveNetwork] = useState(
    networks.filter((network) => network.id === blockchain)[0]
  );

  useOnClickOutside(ref, () => setIsDropdownOpened(false));

  const handleNetworkSelect = useCallback(
    (network: Network) => {
      if (onSelect) {
        onSelect(network.id);
      }
      setActiveNetwork(network);
      setIsDropdownOpened(false);
    },
    [onSelect]
  );

  return (
    <div ref={ref} tw="relative w-28 h-full">
      <div
        tw="w-full h-full flex items-center px-1.5 cursor-pointer"
        // onClick={() => setIsDropdownOpened(true)}
      >
        {activeNetwork.icon} &nbsp;&nbsp;
        {activeNetwork.name}
      </div>

      {isDropdownOpened && (
        <DropdownWrapper>
          {networks.map((network, index) => (
            <div
              key={index}
              css={[
                tw`flex items-center text-gray-300 px-2 py-1.5 cursor-pointer hover:bg-gray-800`,
                index === 0 && tw`border-t border-solid border-gray-400`,
              ]}
              onClick={() => handleNetworkSelect(network)}
            >
              <div tw="flex items-center text-gray-200">
                {network.icon} &nbsp;&nbsp;
                {network.name}
              </div>
            </div>
          ))}
        </DropdownWrapper>
      )}
    </div>
  );
};
