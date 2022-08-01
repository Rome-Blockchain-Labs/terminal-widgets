import { WETH } from '@rbl/velox-common/uniV2ClonesSDK';
import { useWeb3React } from '@romeblockchain/wallet';
import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json';
import { Contract } from 'ethers';
import { useContext, useMemo } from 'react';

import ENS_PUBLIC_RESOLVER_ABI from '../constants/abis/ens-public-resolver.json';
import ENS_ABI from '../constants/abis/ens-registrar.json';
import { ERC20_BYTES32_ABI } from '../constants/abis/erc20';
import ERC20_ABI from '../constants/abis/erc20.json';
import WETH_ABI from '../constants/abis/weth.json';
import { NetworkChainId } from '../constants/networkExchange';
import { DappContext } from '../contexts';
import { getContract } from '../utils';

// returns null on errors
function useContract(
  address: string | undefined | 0,
  ABI: any,
  withSignerIfPossible = true
): Contract | null {
  const { account, provider: library } = useWeb3React();
  return useMemo(() => {
    if (!address || !ABI || !library) return null;
    try {
      return getContract(
        address,
        ABI,
        library,
        withSignerIfPossible && account ? account : undefined
      );
    } catch (error) {
      console.error('Failed to get contract', error);
      return null;
    }
  }, [address, ABI, library, withSignerIfPossible, account]);
}

export function useTokenContract(
  tokenAddress?: string,
  withSignerIfPossible?: boolean
): Contract | null {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible);
}

export function useWETHContract(
  withSignerIfPossible?: boolean
): Contract | null {
  const { chainId } = useWeb3React();

  return useContract(
    //@ts-ignore
    chainId ? WETH[chainId].address : undefined,
    WETH_ABI,
    withSignerIfPossible
  );
}

export function useENSRegistrarContract(
  withSignerIfPossible?: boolean
): Contract | null {
  const { chainId } = useWeb3React();
  let address: string | undefined;
  if (chainId) {
    switch (chainId) {
      case NetworkChainId.AVALANCHE:
        address = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e';
        break;
      /** cases missing but this is only used on trader joe which is deprecated **/
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
  const { chainId } = useWeb3React();
  const { multicall } = useContext(DappContext);
  return useContract(chainId && multicall.address, multicall.ABI, false);
}
