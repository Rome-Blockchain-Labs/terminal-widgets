import { ChainId, WETH } from '@dynamic-amm/sdk';
import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json';
import { Contract } from 'ethers';
import { useMemo } from 'react';

import { useWallets } from '../../../contexts/WalletsContext/WalletContext';
import {
  FACTORY_ADDRESSES,
  FAIRLAUNCH_ADDRESSES,
  ZAP_ADDRESSES,
} from '../constants';
import {
  ARGENT_WALLET_DETECTOR_ABI,
  ARGENT_WALLET_DETECTOR_MAINNET_ADDRESS,
} from '../constants/abis/argent-wallet-detector';
import FACTORY_ABI from '../constants/abis/dmm-factory.json';
import ENS_PUBLIC_RESOLVER_ABI from '../constants/abis/ens-public-resolver.json';
import ENS_ABI from '../constants/abis/ens-registrar.json';
import { ERC20_BYTES32_ABI } from '../constants/abis/erc20';
import ERC20_ABI from '../constants/abis/erc20.json';
import FAIRLAUNCH_ABI from '../constants/abis/fairlaunch.json';
import REWARD_LOCKER_ABI from '../constants/abis/reward-locker.json';
import UNISOCKS_ABI from '../constants/abis/unisocks.json';
import WETH_ABI from '../constants/abis/weth.json';
import ZAP_ABI from '../constants/abis/zap.json';
import { MULTICALL_ABI, MULTICALL_NETWORKS } from '../constants/multicall';
import { useRewardLockerAddresses } from '../state/vesting/hooks';
import { getContract, getContractForReading } from '../utils';
import { providers } from './index';

// returns null on errors
export function useContract(
  address: string | undefined | 0,
  ABI: any,
  withSignerIfPossible = true
): Contract | null {
  const { account, provider } = useWallets();
  return useMemo(() => {
    if (!address || !ABI || !provider) return null;
    try {
      return getContract(
        address,
        ABI,
        provider,
        withSignerIfPossible && account ? account : undefined
      );
    } catch (error) {
      console.error('Failed to get contract', error);
      return null;
    }
  }, [address, ABI, provider, withSignerIfPossible, account]);
}

export function useContractForReading(
  address: string | undefined | 0,
  ABI: any,
  withSignerIfPossible = true
): Contract | null {
  const { chainId } = useWallets();

  return useMemo(() => {
    if (!address || !chainId) return null;
    const provider = providers[chainId as keyof typeof providers];
    try {
      return getContractForReading(address, ABI, provider);
    } catch (error) {
      console.error('Failed to get contract', error);
      return null;
    }
  }, [address, ABI, chainId]);
}

// returns null on errors
export function useMultipleContracts(
  addresses: string[] | undefined | 0,
  ABI: any,
  withSignerIfPossible = true
): {
  [key: string]: Contract;
} | null {
  const { account, provider } = useWallets();

  return useMemo(() => {
    if (
      !addresses ||
      !Array.isArray(addresses) ||
      addresses.length === 0 ||
      !ABI ||
      !provider
    )
      return null;

    const result: {
      [key: string]: Contract;
    } = {};

    try {
      addresses.forEach((address) => {
        if (address) {
          result[address] = getContract(
            address,
            ABI,
            provider,
            withSignerIfPossible && account ? account : undefined
          );
        }
      });

      if (Object.keys(result).length > 0) {
        return result;
      }

      return null;
    } catch (error) {
      console.error('Failed to get contract', error);

      return null;
    }
  }, [addresses, ABI, provider, withSignerIfPossible, account]);
}

export function useTokenContract(
  tokenAddress?: string,
  withSignerIfPossible?: boolean
): Contract | null {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible);
}

export function useTokenContractForReading(
  tokenAddress?: string,
  withSignerIfPossible?: boolean
): Contract | null {
  return useContractForReading(tokenAddress, ERC20_ABI, withSignerIfPossible);
}

export function useWETHContract(
  withSignerIfPossible?: boolean
): Contract | null {
  const { chainId } = useWallets();
  return useContract(
    chainId ? WETH[chainId as keyof typeof WETH].address : undefined,
    WETH_ABI,
    withSignerIfPossible
  );
}

export function useArgentWalletDetectorContract(): Contract | null {
  const { chainId } = useWallets();
  return useContract(
    chainId === ChainId.MAINNET
      ? ARGENT_WALLET_DETECTOR_MAINNET_ADDRESS
      : undefined,
    ARGENT_WALLET_DETECTOR_ABI,
    false
  );
}

export function useENSRegistrarContract(
  withSignerIfPossible?: boolean
): Contract | null {
  const { chainId } = useWallets();
  let address: string | undefined;
  if (chainId) {
    switch (chainId) {
      case ChainId.MAINNET:
      case ChainId.GÖRLI:
      case ChainId.ROPSTEN:
      case ChainId.RINKEBY:
        address = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e';
        break;
    }
  }
  return useContract(address, ENS_ABI, withSignerIfPossible);
}

export function useENSResolverContract(
  address: string | undefined,
  withSignerIfPossible?: boolean
): Contract | null {
  return useContract(address, ENS_PUBLIC_RESOLVER_ABI, withSignerIfPossible);
}

export function useBytes32TokenContract(
  tokenAddress?: string,
  withSignerIfPossible?: boolean
): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible);
}

export function usePairContract(
  pairAddress?: string,
  withSignerIfPossible?: boolean
): Contract | null {
  return useContract(pairAddress, IUniswapV2PairABI, withSignerIfPossible);
}

export function useMulticallContract(): Contract | null {
  const { chainId } = useWallets();
  return useContractForReading(
    chainId && MULTICALL_NETWORKS[chainId as keyof typeof MULTICALL_NETWORKS],
    MULTICALL_ABI,
    false
  );
}

export function useSocksController(): Contract | null {
  const { chainId } = useWallets();
  return useContract(
    chainId === ChainId.MAINNET
      ? '0x65770b5283117639760beA3F867b69b3697a91dd'
      : undefined,
    UNISOCKS_ABI,
    false
  );
}

export function useFactoryContract(): Contract | null {
  const { chainId } = useWallets();

  return useContract(
    chainId && FACTORY_ADDRESSES[chainId as keyof typeof FACTORY_ADDRESSES],
    FACTORY_ABI
  );
}

export function useZapContract(): Contract | null {
  const { chainId } = useWallets();

  return useContract(
    chainId && ZAP_ADDRESSES[chainId as keyof typeof ZAP_ADDRESSES],
    ZAP_ABI
  );
}

export function useFairLaunchContracts(withSignerIfPossible?: boolean): {
  [key: string]: Contract;
} | null {
  const { chainId } = useWallets();

  return useMultipleContracts(
    chainId &&
      FAIRLAUNCH_ADDRESSES[chainId as keyof typeof FAIRLAUNCH_ADDRESSES],
    FAIRLAUNCH_ABI,
    withSignerIfPossible
  );
}

export function useFairLaunchContract(
  address: string,
  withSignerIfPossible?: boolean
): Contract | null {
  return useContract(address, FAIRLAUNCH_ABI, withSignerIfPossible);
}

export function useRewardLockerContracts(withSignerIfPossible?: boolean): {
  [key: string]: Contract;
} | null {
  const rewardLockerAddresses = useRewardLockerAddresses();

  return useMultipleContracts(
    rewardLockerAddresses,
    REWARD_LOCKER_ABI,
    withSignerIfPossible
  );
}

export function useRewardLockerContract(
  address: string,
  withSignerIfPossible?: boolean
): Contract | null {
  return useContract(address, REWARD_LOCKER_ABI, withSignerIfPossible);
}
