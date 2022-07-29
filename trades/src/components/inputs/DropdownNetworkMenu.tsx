import { FC, useCallback, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import tw, { styled, theme } from 'twin.macro';
import useOnClickOutside from 'use-onclickoutside';

import { NetworkName } from '../../constants/networkExchange';
import { Network } from '../../types';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  Avalanche2Icon,
  AvalancheIcon,
  Binance2Icon,
  BinanceIcon,
  Ethereum2Icon,
  EthereumIcon,
} from '../icons';

type DropdownNetworkMenuProps = {
  mobileActiveNetwork: NetworkName;
  onSelect?: (network: NetworkName) => void;
};

const DropdownWrapper = styled.div`
  ${tw`absolute top-full left-0 bg-gray-500  pb-1 flex flex-col justify-center whitespace-nowrap min-w-full z-50`}

  &::-webkit-scrollbar-thumb {
    ${tw`bg-gray-500 rounded-md border-2 border-solid border-gray-400`}
  }
  &::-webkit-scrollbar-track {
    ${tw`bg-gray-400 rounded-lg`}
  }

  @media only screen and (max-width: 768px) {
    ${tw`bg-dark-900`}
  }
`;

const NETWORKS: Network[] = [
  {
    activeIcon: <Avalanche2Icon height={18} width={18} />,
    icon: (
      <AvalancheIcon color={theme`colors.gray.200`} height={18} width={18} />
    ),
    id: NetworkName.AVALANCHE,
    name: 'AVALANCHE',
  },
  // {
  //   activeIcon: <Polkadot2Icon height={18} width={18} />,
  //   icon: (
  //     <PolkadotIcon color={theme`colors.gray.200`} height={18} width={18} />
  //   ),
  //   id: NetworkName.POLKADOT,
  //   name: 'POLKADOT',
  // },
  {
    activeIcon: <Ethereum2Icon height={18} width={18} />,
    icon: (
      <EthereumIcon color={theme`colors.gray.200`} height={18} width={18} />
    ),
    id: NetworkName.ETHEREUM,
    name: 'ETHEREUM',
  },
  // {
  //   activeIcon: <Solana2Icon height={18} width={18} />,
  //   icon: <SolanaIcon color={theme`colors.gray.200`} height={18} width={18} />,
  //   id: NetworkName.SOLANA,
  //   name: 'SOLANA',
  // },
  {
    activeIcon: <Binance2Icon height={18} width={18} />,
    icon: <BinanceIcon color={theme`colors.gray.200`} height={18} width={18} />,
    id: NetworkName.BINANCE,
    name: 'BINANCE',
  },
  // {
  //   activeIcon: <Stellar2Icon height={18} width={18} />,
  //   icon: <StellarIcon color={theme`colors.gray.200`} height={18} width={18} />,
  //   id: NetworkName.STELLAR,
  //   name: 'STELLAR',
  // },
  // {
  //   activeIcon: <Tron2Icon height={18} width={18} />,
  //   icon: <TronIcon color={theme`colors.gray.200`} height={18} width={18} />,
  //   id: NetworkName.TRON,
  //   name: 'TRON',
  // },
  // {
  //   activeIcon: <Eos2Icon height={18} width={18} />,
  //   icon: <EosIcon color={theme`colors.gray.200`} height={18} width={18} />,
  //   id: NetworkName.EOS,
  //   name: 'EOS',
  // },
  // {
  //   activeIcon: <Tezos2Icon height={18} width={18} />,
  //   icon: <TezosIcon color={theme`colors.gray.200`} height={18} width={18} />,
  //   id: NetworkName.TEZOS,
  //   name: 'TEZOS',
  // },
  // {
  //   activeIcon: <Cardano2Icon height={18} width={18} />,
  //   icon: <CardanoIcon color={theme`colors.gray.200`} height={18} width={18} />,
  //   id: NetworkName.CARDANO,
  //   name: 'CARDANO',
  // },
  // {
  //   activeIcon: <Cosmos2Icon height={18} width={18} />,
  //   icon: <CosmosIcon color={theme`colors.gray.200`} height={18} width={18} />,
  //   id: NetworkName.COSMOS,
  //   name: 'COSMOS',
  // },
  // {
  //   activeIcon: <Nuls2Icon height={18} width={18} />,
  //   icon: <NulsIcon color={theme`colors.gray.200`} height={18} width={18} />,
  //   id: NetworkName.NULS,
  //   name: 'NULS',
  // },
];

export const DropdownNetworkMenu: FC<DropdownNetworkMenuProps> = ({
  mobileActiveNetwork,
  onSelect,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isDropdownOpened, setIsDropdownOpened] = useState(false);
  const [activeNetwork, setActiveNetwork] = useState(
    NETWORKS.filter((network) => network.id === mobileActiveNetwork)[0]
  );
  const isMobile = useMediaQuery({ maxWidth: 767 });

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
    <div ref={ref} tw="relative w-full h-full">
      <div
        style={{ fontSize: '12px' }}
        tw="w-full h-full flex items-center justify-center px-1.5 cursor-pointer"
        // onClick={() => setIsDropdownOpened(!isDropdownOpened)}
      >
        {activeNetwork.name === 'none' ? (
          <>
            SELECT BLOCKCHAIN &nbsp;
            {isDropdownOpened ? (
              <ArrowUpIcon color={theme`colors.white`} height={24} width={10} />
            ) : (
              <ArrowDownIcon
                color={theme`colors.white`}
                height={24}
                width={10}
              />
            )}
          </>
        ) : (
          <>
            {activeNetwork.activeIcon} &nbsp;&nbsp;
            {activeNetwork.name}
          </>
        )}
      </div>

      {isDropdownOpened && (
        <DropdownWrapper>
          {NETWORKS.slice(1).map((network, index) => (
            <div
              key={index}
              css={[
                tw`flex items-center text-gray-300 px-2 py-1.5 cursor-pointer hover:bg-gray-800`,
                index === 0 && tw`border-t border-solid border-gray-400`,
                isMobile && tw`py-2`,
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
